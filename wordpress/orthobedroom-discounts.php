<?php
/**
 * OrthoBedroom discount rules (WooCommerce).
 *
 * Install: WordPress admin → Plugins → Add New → "Code Snippets" → install & activate →
 *          Snippets → Add New → paste this file (without the opening "<?php" line if the editor adds its own) →
 *          "Run snippet everywhere" → Save and Activate.
 *
 * 1. Marketer codes (start with PARTNER-): percentage off the ORIGINAL (regular) price. While one is applied,
 *    cart prices revert from the sale price to the regular price. Never combinable with other codes.
 *    Create them in Marketing → Coupons: code PARTNER-NAME, "Percentage discount", amount 30.
 * 2. Sign-up codes (start with WELCOME-): created automatically when someone signs up on www.orthobedroom.co.uk,
 *    shown on screen and emailed to them, 10% off the current (sale) price, one use, first order only (checked at
 *    checkout), expires after OB_SIGNUP_EXPIRY_DAYS. Never combinable with other codes.
 * 3. Every sign-up email is saved in the database table wp_ob_signups.
 *    View or download them (CSV) in WooCommerce → Sign-ups.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'OB_PARTNER_PREFIX' ) ) {
	define( 'OB_PARTNER_PREFIX', 'partner-' );     // marketer codes (case-insensitive)
	define( 'OB_SIGNUP_PREFIX', 'welcome-' );      // sign-up codes (case-insensitive)
	define( 'OB_SIGNUP_PERCENT', 10 );             // sign-up discount, % of the sale price
	define( 'OB_SIGNUP_EXPIRY_DAYS', 30 );         // 0 = never expires; e.g. 30 = expires after 30 days
	define( 'OB_SIGNUP_MAX_PER_HOUR', 5 );         // sign-ups allowed per visitor IP per hour (spam guard)
	define( 'OB_SITE_URL', 'https://www.orthobedroom.co.uk' );
	define( 'OB_SIGNUPS_DB_VERSION', '1' );
}

/** "partner", "signup" or "" for a coupon code. */
function ob_coupon_kind( $code ) {
	$code = strtolower( (string) $code );
	if ( 0 === strpos( $code, OB_PARTNER_PREFIX ) ) {
		return 'partner';
	}
	if ( 0 === strpos( $code, OB_SIGNUP_PREFIX ) ) {
		return 'signup';
	}
	return '';
}

/** Marketer and sign-up codes are always "individual use" (cannot be combined with any other code). */
add_filter( 'woocommerce_coupon_get_individual_use', function ( $individual_use, $coupon ) {
	return ob_coupon_kind( $coupon->get_code() ) ? true : $individual_use;
}, 10, 2 );

/** While a marketer code is applied, items are priced at their ORIGINAL price (the sale price is ignored). */
add_action( 'woocommerce_before_calculate_totals', function ( $cart ) {
	if ( is_admin() && ! wp_doing_ajax() ) {
		return;
	}
	$has_partner_code = false;
	foreach ( $cart->get_applied_coupons() as $code ) {
		if ( 'partner' === ob_coupon_kind( $code ) ) {
			$has_partner_code = true;
			break;
		}
	}
	if ( ! $has_partner_code ) {
		return;
	}
	foreach ( $cart->get_cart() as $item ) {
		$regular = (float) $item['data']->get_regular_price();
		if ( $regular > 0 ) {
			$item['data']->set_price( $regular );
		}
	}
}, 20 );

/** True when this email already has a paid order. */
function ob_has_previous_order( $email ) {
	if ( ! $email ) {
		return false;
	}
	$orders = wc_get_orders( array(
		'billing_email' => $email,
		'status'        => array( 'wc-processing', 'wc-completed', 'wc-on-hold' ),
		'limit'         => 1,
		'return'        => 'ids',
	) );
	return ! empty( $orders );
}

/** Sign-up codes only work on a customer's first order. */
add_filter( 'woocommerce_coupon_is_valid', function ( $valid, $coupon ) {
	if ( ! $valid || 'signup' !== ob_coupon_kind( $coupon->get_code() ) ) {
		return $valid;
	}
	$email = ( WC()->customer ) ? WC()->customer->get_billing_email() : '';
	if ( ob_has_previous_order( $email ) ) {
		throw new Exception( __( 'This welcome code is for your first order only.', 'woocommerce' ) );
	}
	return $valid;
}, 10, 2 );

/** Existing sign-up code for an email, or null. */
function ob_find_signup_coupon( $email ) {
	$ids = get_posts( array(
		'post_type'      => 'shop_coupon',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_key'       => '_ob_signup_email',
		'meta_value'     => $email,
	) );
	return $ids ? new WC_Coupon( $ids[0] ) : null;
}

/* ── Sign-ups list (database table wp_ob_signups) ── */

function ob_signups_table() {
	global $wpdb;
	return $wpdb->prefix . 'ob_signups';
}

/** Saves (or updates) a sign-up. $coupon is null for existing customers (they get no code). */
function ob_save_signup( $email, $first_name, $coupon = null, $created_gmt = null ) {
	global $wpdb;
	$table   = ob_signups_table();
	$now     = current_time( 'mysql', true );
	$expires = ( $coupon && $coupon->get_date_expires() ) ? gmdate( 'Y-m-d H:i:s', $coupon->get_date_expires()->getTimestamp() ) : null;
	$row     = array( 'updated_at' => $now );
	if ( $coupon ) {
		$row['code']       = $coupon->get_code();
		$row['expires_at'] = $expires;
	}
	if ( '' !== (string) $first_name ) {
		$row['first_name'] = $first_name;
	}
	$id = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$table} WHERE email = %s", $email ) );
	if ( $id ) {
		$wpdb->update( $table, $row, array( 'id' => $id ) );
		return;
	}
	$wpdb->insert( $table, $row + array(
		'email'      => $email,
		'first_name' => (string) $first_name,
		'code'       => '',
		'created_at' => $created_gmt ? $created_gmt : $now,
	) );
}

/** Creates the table once, and copies in everyone who signed up before it existed. */
add_action( 'init', function () {
	if ( get_option( 'ob_signups_db' ) === OB_SIGNUPS_DB_VERSION || ! class_exists( 'WC_Coupon' ) ) {
		return;
	}
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$table   = ob_signups_table();
	$collate = $wpdb->get_charset_collate();
	dbDelta( "CREATE TABLE {$table} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		email varchar(190) NOT NULL,
		first_name varchar(100) NOT NULL DEFAULT '',
		code varchar(60) NOT NULL DEFAULT '',
		expires_at datetime NULL,
		created_at datetime NOT NULL,
		updated_at datetime NOT NULL,
		PRIMARY KEY  (id),
		UNIQUE KEY email (email)
	) {$collate};" );

	$ids = get_posts( array(
		'post_type'      => 'shop_coupon',
		'post_status'    => 'any',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		'meta_key'       => '_ob_signup_email',
	) );
	foreach ( $ids as $id ) {
		ob_save_signup(
			get_post_meta( $id, '_ob_signup_email', true ),
			get_post_meta( $id, '_ob_signup_first_name', true ),
			new WC_Coupon( $id ),
			get_post_field( 'post_date_gmt', $id )
		);
	}
	update_option( 'ob_signups_db', OB_SIGNUPS_DB_VERSION );
} );

/** Sign-ups, newest first, with whether each welcome code has been used. */
function ob_signup_rows( $limit = 0 ) {
	global $wpdb;
	$sql = 'SELECT * FROM ' . ob_signups_table() . ' ORDER BY created_at DESC';
	if ( $limit > 0 ) {
		$sql .= $wpdb->prepare( ' LIMIT %d', $limit );
	}
	$rows = $wpdb->get_results( $sql, ARRAY_A );
	foreach ( $rows as &$row ) {
		$coupon_id   = $row['code'] ? wc_get_coupon_id_by_code( $row['code'] ) : 0;
		$row['used'] = ( $coupon_id && (int) get_post_meta( $coupon_id, 'usage_count', true ) > 0 ) ? 'Yes' : 'No';
	}
	return $rows;
}

/** "26 Oct 2026" in the site's timezone, from a GMT database date. */
function ob_signup_date( $gmt ) {
	return $gmt ? wp_date( 'j M Y', strtotime( $gmt . ' UTC' ) ) : '';
}

/** One row of the admin table / CSV. */
function ob_signup_columns( $row ) {
	return array(
		ob_signup_date( $row['created_at'] ),
		$row['email'],
		$row['first_name'],
		strtoupper( $row['code'] ),
		$row['code'] ? ( $row['expires_at'] ? ob_signup_date( $row['expires_at'] ) : 'Never' ) : '',
		$row['code'] ? $row['used'] : '',
	);
}

/** WooCommerce → Sign-ups: everyone who signed up, with a CSV download. */
add_action( 'admin_menu', function () {
	add_submenu_page( 'woocommerce', 'Sign-ups', 'Sign-ups', 'manage_woocommerce', 'ob-signups', function () {
		global $wpdb;
		$total = (int) $wpdb->get_var( 'SELECT COUNT(*) FROM ' . ob_signups_table() );
		$csv   = wp_nonce_url( admin_url( 'admin-post.php?action=ob_signups_csv' ), 'ob_signups_csv' );
		echo '<div class="wrap"><h1 class="wp-heading-inline">Sign-ups</h1> ';
		echo '<a class="page-title-action" href="' . esc_url( $csv ) . '">Download CSV</a>';
		echo '<p>' . esc_html( $total ) . ' people have signed up on the website (latest 500 shown; the CSV has everyone).</p>';
		echo '<table class="widefat striped"><thead><tr><th>Signed up</th><th>Email</th><th>First name</th><th>Welcome code</th><th>Expires</th><th>Code used</th></tr></thead><tbody>';
		$rows = ob_signup_rows( 500 );
		if ( ! $rows ) {
			echo '<tr><td colspan="6">No sign-ups yet.</td></tr>';
		}
		foreach ( $rows as $row ) {
			echo '<tr>';
			foreach ( ob_signup_columns( $row ) as $cell ) {
				echo '<td>' . esc_html( $cell ) . '</td>';
			}
			echo '</tr>';
		}
		echo '</tbody></table></div>';
	} );
} );

add_action( 'admin_post_ob_signups_csv', function () {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		wp_die( 'Not allowed.' );
	}
	check_admin_referer( 'ob_signups_csv' );
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=orthobedroom-signups-' . gmdate( 'Y-m-d' ) . '.csv' );
	$out = fopen( 'php://output', 'w' );
	fputcsv( $out, array( 'Signed up', 'Email', 'First name', 'Welcome code', 'Expires', 'Code used' ) );
	foreach ( ob_signup_rows() as $row ) {
		// Spreadsheets run cells starting with = + - @ as formulas; prefix them so they stay plain text.
		$cells = array_map( function ( $cell ) {
			return preg_match( '/^[=+\-@]/', (string) $cell ) ? "'" . $cell : $cell;
		}, ob_signup_columns( $row ) );
		fputcsv( $out, $cells );
	}
	fclose( $out );
	exit;
} );

/* ── Sign-up endpoint ── */

function ob_send_signup_email( $email, $first_name, $code, $expires_label ) {
	$hello   = $first_name ? sprintf( 'Hi %s,', esc_html( $first_name ) ) : 'Hi,';
	$subject = sprintf( 'Your %d%% welcome code from OrthoBedroom.co.uk', OB_SIGNUP_PERCENT );
	$body    = '<p>' . $hello . '</p>'
		. '<p>Thanks for signing up. Here is your welcome code for <strong>' . OB_SIGNUP_PERCENT . '% off your first order</strong>:</p>'
		. '<p style="font-size:22px;font-weight:700;letter-spacing:1px">' . esc_html( strtoupper( $code ) ) . '</p>'
		. '<p>Enter it in your basket or at checkout. It can be used once, on your first order, and cannot be combined with other codes.'
		. ( $expires_label ? ' It expires on ' . esc_html( $expires_label ) . '.' : '' ) . '</p>'
		. '<p><a href="' . esc_url( OB_SITE_URL . '/collections/bedroom/mattresses/' ) . '">Shop orthopaedic mattresses</a></p>'
		. '<p>OrthoBedroom.co.uk</p>';
	return wp_mail( $email, $subject, $body, array( 'Content-Type: text/html; charset=UTF-8' ) );
}

/**
 * POST /wp-json/orthobedroom/v1/signup  { email, first_name?, website? (honeypot) }
 * Returns { ok, message } plus { code, percent, expires (Y-m-d or null) } when there is a code to show.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'orthobedroom/v1', '/signup', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$signed_up = array( 'ok' => true, 'message' => "Thanks! You're signed up." );

			// Honeypot: real visitors never fill this hidden field. Pretend success to bots.
			if ( '' !== trim( (string) $request->get_param( 'website' ) ) ) {
				return rest_ensure_response( $signed_up );
			}

			$email      = sanitize_email( (string) $request->get_param( 'email' ) );
			$first_name = sanitize_text_field( (string) $request->get_param( 'first_name' ) );
			if ( ! is_email( $email ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Please enter a valid email address.' ), 400 );
			}

			// Spam guard: limit sign-ups per visitor IP per hour. Requests arrive via the site's proxy (Vercel), so
			// REMOTE_ADDR is the proxy's IP; the visitor's IP is the first entry of X-Forwarded-For.
			$forwarded = (string) ( $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '' );
			$visitor   = $forwarded ? trim( explode( ',', $forwarded )[0] ) : (string) ( $_SERVER['REMOTE_ADDR'] ?? '' );
			$ip_key    = 'ob_signup_' . md5( $visitor );
			$count  = (int) get_transient( $ip_key );
			if ( $count >= OB_SIGNUP_MAX_PER_HOUR ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Too many sign-ups. Please try again later.' ), 429 );
			}
			set_transient( $ip_key, $count + 1, HOUR_IN_SECONDS );

			// Existing customers don't get a first-order code, but are still saved as sign-ups.
			if ( ob_has_previous_order( $email ) ) {
				ob_save_signup( $email, $first_name );
				return rest_ensure_response( $signed_up );
			}

			// One code per email: show the existing one again instead of creating another.
			$coupon = ob_find_signup_coupon( $email );
			if ( ! $coupon ) {
				$coupon = new WC_Coupon();
				$coupon->set_code( OB_SIGNUP_PREFIX . strtolower( wp_generate_password( 8, false, false ) ) );
				$coupon->set_discount_type( 'percent' );
				$coupon->set_amount( OB_SIGNUP_PERCENT );
				$coupon->set_individual_use( true );
				$coupon->set_usage_limit( 1 );
				$coupon->set_usage_limit_per_user( 1 );
				// No email restriction: it would stop the code being applied in the basket (email unknown there).
				// The code is random, single-use, and first-order-only (checked against the billing email at checkout).
				$coupon->set_description( 'Sign-up welcome code for ' . $email );
				if ( OB_SIGNUP_EXPIRY_DAYS > 0 ) {
					$coupon->set_date_expires( time() + OB_SIGNUP_EXPIRY_DAYS * DAY_IN_SECONDS );
				}
				$coupon->save();
				update_post_meta( $coupon->get_id(), '_ob_signup_email', $email );
				update_post_meta( $coupon->get_id(), '_ob_signup_first_name', $first_name );
			}
			ob_save_signup( $email, $first_name, $coupon );

			$expires = $coupon->get_date_expires();
			if ( $coupon->get_usage_count() >= max( 1, (int) $coupon->get_usage_limit() ) ) {
				return rest_ensure_response( array( 'ok' => true, 'message' => "Thanks for signing up! You've already used your welcome code on an order." ) );
			}
			if ( $expires && $expires->getTimestamp() < time() ) {
				return rest_ensure_response( array( 'ok' => true, 'message' => 'Thanks for signing up! The welcome code for this email has expired.' ) );
			}

			// The code is shown on screen as well, so a failed email no longer blocks the sign-up.
			$expires_label = $expires ? wp_date( 'j F Y', $expires->getTimestamp() ) : '';
			if ( ! ob_send_signup_email( $email, $first_name, $coupon->get_code(), $expires_label ) ) {
				error_log( 'OrthoBedroom sign-up: wp_mail failed for ' . $email );
			}
			return rest_ensure_response( array(
				'ok'      => true,
				'message' => "Here's your welcome code. We've also emailed it to you.",
				'code'    => strtoupper( $coupon->get_code() ),
				'percent' => OB_SIGNUP_PERCENT,
				'expires' => $expires ? wp_date( 'Y-m-d', $expires->getTimestamp() ) : null,
			) );
		},
	) );
} );
