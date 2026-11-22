<?php
/**
 * OrthoBedroom discount rules (WooCommerce).
 *
 * Install: WordPress admin → Plugins → Add New → "Code Snippets" → install & activate →
 *          Snippets → Add New → paste this file (without the opening "<?php" line if the editor adds its own) →
 *          "Run snippet everywhere" → Save and Activate.
 *
 * 1. Marketer codes (every code that does NOT start with WELCOME-, e.g. ASH30 or PARTNER-SARAH): percentage off
 *    the ORIGINAL (regular) price. While one is applied, cart prices revert from the sale price to the regular
 *    price. Never combinable with other codes.
 *    Create them in Marketing → Coupons: any code name, "Percentage discount", amount 30.
 * 2. Sign-up codes (start with WELCOME-): 10% off the current (sale) price, one use, first order only (checked at
 *    checkout), expire after OB_SIGNUP_EXPIRY_DAYS. Never combinable with other codes.
 * 3. Newsletter sign-ups use DOUBLE OPT-IN: signing up on www.orthobedroom.co.uk sends a "confirm your email" link.
 *    Only after the link is clicked is the person subscribed: they are added to the Brevo list and get their
 *    welcome code (on screen and by email). Every sign-up is saved in the database table wp_ob_signups, with the
 *    date it was confirmed. View or download them (CSV) in WooCommerce → Sign-ups.
 *    Emails are sent with Brevo. Add to wp-config.php (above "That's all, stop editing!"):
 *      define( 'OB_BREVO_API_KEY', 'xkeysib-...' );         // Brevo → SMTP & API → API keys
 *      define( 'OB_BREVO_LIST_ID', 3 );                     // Brevo → Contacts → Lists → the list's ID number
 *      define( 'OB_MAIL_FROM', 'info@tqpl.co.uk' );   // optional: the sender (default info@tqpl.co.uk, verified in Brevo)
 *    Without the API key, emails fall back to WordPress' own mail (wp_mail) and no Brevo list is updated.
 * 4. "Work with Us" applications from digital marketers (www.orthobedroom.co.uk/work-with-us/) are saved in
 *    wp_ob_applications. View or download them (CSV) in WooCommerce → Marketer applications.
 * 5. Spam protection (Cloudflare Turnstile) for checkout, sign-ups and applications. OFF until switched on:
 *    Cloudflare dashboard → Turnstile → Add widget (domain www.orthobedroom.co.uk, mode "Managed"), then
 *    - add the SECRET key to wp-config.php:  define( 'OB_TURNSTILE_SECRET', 'your-secret-key' );
 *    - add the SITE key in Vercel as NEXT_PUBLIC_TURNSTILE_SITE_KEY and redeploy the site.
 *    Add the Vercel key first (or both together): once the secret is set, requests without a valid token are refused.
 *    Note: with the secret set, orders can only be placed from www.orthobedroom.co.uk (not WordPress' own checkout).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'OB_PARTNER_PREFIX' ) ) {
	define( 'OB_PARTNER_PREFIX', 'partner-' );     // old marketer prefix; any non-WELCOME code is a marketer code now
	define( 'OB_SIGNUP_PREFIX', 'welcome-' );      // sign-up codes (case-insensitive)
	define( 'OB_SIGNUP_PERCENT', 10 );             // sign-up discount, % of the sale price
	define( 'OB_SIGNUP_EXPIRY_DAYS', 30 );         // 0 = never expires; e.g. 30 = expires after 30 days
	define( 'OB_SIGNUP_MAX_PER_HOUR', 5 );         // sign-ups allowed per visitor IP per hour (spam guard)
	define( 'OB_SITE_URL', 'https://www.orthobedroom.co.uk' );
	define( 'OB_SIGNUPS_DB_VERSION', '2' );        // 2: double opt-in columns
	define( 'OB_CONFIRM_LINK_DAYS', 7 );           // how long a "confirm your email" link works
	define( 'OB_CONFIRM_RESEND_MINUTES', 5 );      // no new confirmation email for the same address within this time
	define( 'OB_MAIL_FROM_NAME', 'OrthoBedroom' );
	define( 'OB_APPLICATIONS_DB_VERSION', '2' );   // 2: social media profile columns
	define( 'OB_APPLY_MAX_PER_HOUR', 3 );          // applications allowed per visitor IP per hour (spam guard)
}

/** "signup" for WELCOME- codes, "partner" for every other code (marketer codes: ORIGINAL price), "" for none. */
function ob_coupon_kind( $code ) {
	$code = strtolower( trim( (string) $code ) );
	if ( '' === $code ) {
		return '';
	}
	if ( 0 === strpos( $code, OB_SIGNUP_PREFIX ) ) {
		return 'signup';
	}
	return 'partner';
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
		confirm_token char(64) NOT NULL DEFAULT '',
		confirm_sent_at datetime NULL,
		confirmed_at datetime NULL,
		brevo_synced tinyint(1) NOT NULL DEFAULT 0,
		created_at datetime NOT NULL,
		updated_at datetime NOT NULL,
		PRIMARY KEY  (id),
		UNIQUE KEY email (email),
		KEY confirm_token (confirm_token)
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
	if ( ! empty( $row['confirmed_at'] ) ) {
		$confirmed = ob_signup_date( $row['confirmed_at'] );
	} elseif ( ! empty( $row['confirm_sent_at'] ) ) {
		$confirmed = 'Waiting for confirmation';
	} else {
		$confirmed = 'No (signed up before double opt-in)';
	}
	return array(
		ob_signup_date( $row['created_at'] ),
		$confirmed,
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
		echo '<p>' . esc_html( $total ) . ' people have signed up on the website (latest 500 shown; the CSV has everyone). Only people with a date under "Email confirmed" have agreed to marketing emails (double opt-in) and are on the Brevo list.</p>';
		echo '<table class="widefat striped"><thead><tr><th>Signed up</th><th>Email confirmed</th><th>Email</th><th>First name</th><th>Welcome code</th><th>Expires</th><th>Code used</th></tr></thead><tbody>';
		$rows = ob_signup_rows( 500 );
		if ( ! $rows ) {
			echo '<tr><td colspan="7">No sign-ups yet.</td></tr>';
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
	fputcsv( $out, array( 'Signed up', 'Email confirmed', 'Email', 'First name', 'Welcome code', 'Expires', 'Code used' ) );
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

/* ── Visitor IP rate limit (shared by the endpoints) ── */

/** True when this visitor already made $max requests to $bucket this hour; otherwise counts this one. */
function ob_rate_limited( $bucket, $max ) {
	// Requests arrive via the site's proxy (Vercel), so REMOTE_ADDR is the proxy's IP; the visitor's IP is the
	// first entry of X-Forwarded-For.
	$forwarded = (string) ( $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '' );
	$visitor   = $forwarded ? trim( explode( ',', $forwarded )[0] ) : (string) ( $_SERVER['REMOTE_ADDR'] ?? '' );
	$key       = 'ob_' . $bucket . '_' . md5( $visitor );
	$count     = (int) get_transient( $key );
	if ( $count >= $max ) {
		return true;
	}
	set_transient( $key, $count + 1, HOUR_IN_SECONDS );
	return false;
}

/* ── Spam protection: Cloudflare Turnstile (off until OB_TURNSTILE_SECRET is defined in wp-config.php) ── */

/** True when the token is valid, or when Turnstile is off / Cloudflare can't be reached (never block customers then). */
function ob_turnstile_ok( $token ) {
	if ( ! defined( 'OB_TURNSTILE_SECRET' ) || '' === (string) OB_TURNSTILE_SECRET ) {
		return true;
	}
	$token = trim( (string) $token );
	if ( '' === $token || strlen( $token ) > 2048 ) {
		return false;
	}
	$forwarded = (string) ( $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '' );
	$visitor   = $forwarded ? trim( explode( ',', $forwarded )[0] ) : (string) ( $_SERVER['REMOTE_ADDR'] ?? '' );
	$response  = wp_remote_post( 'https://challenges.cloudflare.com/turnstile/v0/siteverify', array(
		'timeout' => 8,
		'body'    => array( 'secret' => OB_TURNSTILE_SECRET, 'response' => $token, 'remoteip' => $visitor ),
	) );
	if ( is_wp_error( $response ) ) {
		return true;
	}
	$data = json_decode( wp_remote_retrieve_body( $response ), true );
	return is_array( $data ) && ! empty( $data['success'] );
}

/** Checkout (WooCommerce Store API): the site sends the token in the X-OB-Turnstile header. */
add_filter( 'rest_pre_dispatch', function ( $result, $server, $request ) {
	if ( null !== $result || 'POST' !== $request->get_method() ) {
		return $result;
	}
	if ( ! preg_match( '#^/wc/store(/v\d+)?/checkout/?$#', (string) $request->get_route() ) ) {
		return $result;
	}
	if ( ob_turnstile_ok( $request->get_header( 'x_ob_turnstile' ) ) ) {
		return $result;
	}
	return new WP_Error( 'ob_security_check', 'Our security check could not confirm your order. Please refresh the page and try again.', array( 'status' => 403 ) );
}, 10, 3 );

/* ── "Work with Us" applications (database table wp_ob_applications) ── */

function ob_applications_table() {
	global $wpdb;
	return $wpdb->prefix . 'ob_applications';
}

/** Creates the applications table once. */
add_action( 'init', function () {
	if ( get_option( 'ob_applications_db' ) === OB_APPLICATIONS_DB_VERSION ) {
		return;
	}
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$table   = ob_applications_table();
	$collate = $wpdb->get_charset_collate();
	dbDelta( "CREATE TABLE {$table} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		full_name varchar(120) NOT NULL,
		nationality varchar(80) NOT NULL,
		whatsapp varchar(30) NOT NULL,
		email varchar(190) NOT NULL DEFAULT '',
		has_experience tinyint(1) NOT NULL DEFAULT 0,
		experience text NOT NULL,
		instagram varchar(255) NOT NULL DEFAULT '',
		facebook varchar(255) NOT NULL DEFAULT '',
		twitter varchar(255) NOT NULL DEFAULT '',
		tiktok varchar(255) NOT NULL DEFAULT '',
		youtube varchar(255) NOT NULL DEFAULT '',
		created_at datetime NOT NULL,
		PRIMARY KEY  (id),
		KEY created_at (created_at)
	) {$collate};" );
	update_option( 'ob_applications_db', OB_APPLICATIONS_DB_VERSION );
} );

/** Social networks marketers can share on the Work with Us form, with the sites their links may point to. */
function ob_social_networks() {
	return array(
		'instagram' => array( 'Instagram', array( 'instagram.com' ), 'https://www.instagram.com/%s' ),
		'facebook'  => array( 'Facebook', array( 'facebook.com', 'fb.com' ), 'https://www.facebook.com/%s' ),
		'twitter'   => array( 'X (Twitter)', array( 'x.com', 'twitter.com' ), 'https://x.com/%s' ),
		'tiktok'    => array( 'TikTok', array( 'tiktok.com' ), 'https://www.tiktok.com/@%s' ),
		'youtube'   => array( 'YouTube', array( 'youtube.com', 'youtu.be' ), 'https://www.youtube.com/@%s' ),
	);
}

/** "@name", "name" or a link on the network's own site → profile link; '' when empty; false when not valid. */
function ob_social_url( $value, $network ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	if ( strlen( $value ) > 200 ) {
		return false;
	}
	list( , $domains, $pattern ) = $network;
	$handle = ltrim( $value, '@' );
	if ( preg_match( '/^[A-Za-z0-9._-]{1,50}$/', $handle ) && false === strpos( $handle, '..' ) ) {
		return sprintf( $pattern, $handle );
	}
	$url  = preg_match( '#^https?://#i', $value ) ? $value : 'https://' . $value;
	$host = strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) );
	$host = preg_replace( '/^(www\.|m\.|mobile\.)/', '', $host );
	$path = trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' );
	if ( ! in_array( $host, $domains, true ) || '' === $path ) {
		return false;
	}
	return esc_url_raw( preg_replace( '#^http://#i', 'https://', $url ) );
}

/** One application as table / CSV cells. */
function ob_application_columns( $row ) {
	$socials = array();
	foreach ( ob_social_networks() as $key => $network ) {
		if ( ! empty( $row[ $key ] ) ) {
			$socials[] = $network[0] . ': ' . $row[ $key ];
		}
	}
	return array(
		ob_signup_date( $row['created_at'] ),
		$row['full_name'],
		$row['nationality'],
		$row['whatsapp'],
		$row['email'],
		$row['has_experience'] ? 'Yes' : 'No experience',
		$row['experience'],
		implode( "\n", $socials ),
	);
}

/** WooCommerce → Marketer applications: everyone who applied, with a CSV download. */
add_action( 'admin_menu', function () {
	add_submenu_page( 'woocommerce', 'Marketer applications', 'Marketer applications', 'manage_woocommerce', 'ob-applications', function () {
		global $wpdb;
		$table = ob_applications_table();
		$total = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" );
		$csv   = wp_nonce_url( admin_url( 'admin-post.php?action=ob_applications_csv' ), 'ob_applications_csv' );
		echo '<div class="wrap"><h1 class="wp-heading-inline">Marketer applications</h1> ';
		echo '<a class="page-title-action" href="' . esc_url( $csv ) . '">Download CSV</a>';
		echo '<p>' . esc_html( $total ) . ' applications from the Work with Us page (latest 500 shown; the CSV has everyone).</p>';
		echo '<table class="widefat striped"><thead><tr><th>Applied</th><th>Name</th><th>Country of residence</th><th>WhatsApp</th><th>Email</th><th>Experience</th><th>About their experience</th><th>Social profiles</th></tr></thead><tbody>';
		$rows = $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 500", ARRAY_A );
		if ( ! $rows ) {
			echo '<tr><td colspan="8">No applications yet.</td></tr>';
		}
		foreach ( $rows as $row ) {
			echo '<tr>';
			foreach ( ob_application_columns( $row ) as $cell ) {
				echo '<td>' . nl2br( esc_html( $cell ) ) . '</td>';
			}
			echo '</tr>';
		}
		echo '</tbody></table></div>';
	} );
} );

add_action( 'admin_post_ob_applications_csv', function () {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		wp_die( 'Not allowed.' );
	}
	check_admin_referer( 'ob_applications_csv' );
	global $wpdb;
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=orthobedroom-marketer-applications-' . gmdate( 'Y-m-d' ) . '.csv' );
	$out = fopen( 'php://output', 'w' );
	fputcsv( $out, array( 'Applied', 'Name', 'Country of residence', 'WhatsApp', 'Email', 'Experience', 'About their experience', 'Social profiles' ) );
	$rows = $wpdb->get_results( 'SELECT * FROM ' . ob_applications_table() . ' ORDER BY created_at DESC', ARRAY_A );
	foreach ( $rows as $row ) {
		// Spreadsheets run cells starting with = + - @ as formulas; prefix them so they stay plain text.
		$cells = array_map( function ( $cell ) {
			return preg_match( '/^[=+\-@]/', (string) $cell ) ? "'" . $cell : $cell;
		}, ob_application_columns( $row ) );
		fputcsv( $out, $cells );
	}
	fclose( $out );
	exit;
} );

/**
 * POST /wp-json/orthobedroom/v1/apply
 * { full_name, nationality, whatsapp, email?, has_experience (bool), experience?, instagram?, facebook?, twitter?, tiktok?,
 *   youtube?, website? (honeypot), turnstile? }
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'orthobedroom/v1', '/apply', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$thanks = array( 'ok' => true, 'message' => "Thank you! We've received your details and will contact you on WhatsApp." );
			$fail   = function ( $message ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => $message ), 400 );
			};

			// Honeypot: real visitors never fill this hidden field. Pretend success to bots.
			if ( '' !== trim( (string) $request->get_param( 'website' ) ) ) {
				return rest_ensure_response( $thanks );
			}
			if ( ! ob_turnstile_ok( $request->get_param( 'turnstile' ) ) ) {
				return $fail( 'Our security check failed. Please refresh the page and try again.' );
			}

			$name        = sanitize_text_field( (string) $request->get_param( 'full_name' ) );
			$nationality = sanitize_text_field( (string) $request->get_param( 'nationality' ) );
			$whatsapp    = preg_replace( '/[^0-9+]/', '', (string) $request->get_param( 'whatsapp' ) );
			$raw_email   = trim( (string) $request->get_param( 'email' ) );
			$email       = sanitize_email( $raw_email );
			$experienced = rest_sanitize_boolean( $request->get_param( 'has_experience' ) );
			$experience  = sanitize_textarea_field( (string) $request->get_param( 'experience' ) );

			if ( mb_strlen( $name ) < 2 || mb_strlen( $name ) > 120 ) {
				return $fail( 'Please enter your full name.' );
			}
			if ( mb_strlen( $nationality ) < 2 || mb_strlen( $nationality ) > 80 ) {
				return $fail( 'Please enter your country of residence.' );
			}
			if ( ! preg_match( '/^\+?[0-9]{7,15}$/', $whatsapp ) ) {
				return $fail( 'Please enter a valid WhatsApp number, including the country code.' );
			}
			if ( '' !== $raw_email && ! is_email( $email ) ) {
				return $fail( 'Please enter a valid email address, or leave it empty.' );
			}
			if ( $experienced && mb_strlen( $experience ) < 10 ) {
				return $fail( 'Please tell us briefly about your digital marketing experience.' );
			}
			if ( mb_strlen( $experience ) > 2000 ) {
				return $fail( 'Please keep your experience summary under 2000 characters.' );
			}
			$socials = array();
			foreach ( ob_social_networks() as $key => $network ) {
				$url = ob_social_url( $request->get_param( $key ), $network );
				if ( false === $url ) {
					return $fail( 'Please check your ' . $network[0] . ' profile link.' );
				}
				$socials[ $key ] = $url;
			}
			if ( ob_rate_limited( 'apply', OB_APPLY_MAX_PER_HOUR ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Too many applications from this connection. Please try again later.' ), 429 );
			}

			global $wpdb;
			$saved = $wpdb->insert( ob_applications_table(), array(
				'full_name'      => $name,
				'nationality'    => $nationality,
				'whatsapp'       => $whatsapp,
				'email'          => (string) $email,
				'has_experience' => $experienced ? 1 : 0,
				'experience'     => $experience,
				'instagram'      => $socials['instagram'],
				'facebook'       => $socials['facebook'],
				'twitter'        => $socials['twitter'],
				'tiktok'         => $socials['tiktok'],
				'youtube'        => $socials['youtube'],
				'created_at'     => current_time( 'mysql', true ),
			) );
			if ( ! $saved ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => "Sorry, we couldn't save your application. Please try again." ), 500 );
			}

			// Tell the shop owner (arrives once WP Mail SMTP is set up; the application is saved either way).
			$lines = array(
				'Name: ' . $name,
				'Country of residence: ' . $nationality,
				'WhatsApp: ' . $whatsapp,
				'Email: ' . $email,
				'Experience: ' . ( $experienced ? 'Yes' : 'No experience' ),
				'',
				$experience,
				'',
				'Social profiles:',
				implode( "\n", array_filter( $socials ) ) ?: 'None given',
				'',
				'All applications: ' . admin_url( 'admin.php?page=ob-applications' ),
			);
			wp_mail( get_option( 'admin_email' ), 'New marketer application: ' . $name, implode( "\n", $lines ) );
			return rest_ensure_response( $thanks );
		},
	) );
} );

/* ── Email (Brevo) ── */

function ob_mail_from() {
	// Emails come from the TQPL domain (authenticated in Brevo), unless wp-config sets another sender.
	return defined( 'OB_MAIL_FROM' ) && OB_MAIL_FROM ? OB_MAIL_FROM : 'info@tqpl.co.uk';
}

/** Sends an HTML email with Brevo (transactional API), or with wp_mail when Brevo isn't set up. True when accepted. */
function ob_mail( $to, $name, $subject, $html ) {
	if ( defined( 'OB_BREVO_API_KEY' ) && OB_BREVO_API_KEY ) {
		$recipient = array( 'email' => $to );
		if ( '' !== (string) $name ) {
			$recipient['name'] = $name;
		}
		$response = wp_remote_post( 'https://api.brevo.com/v3/smtp/email', array(
			'timeout' => 15,
			'headers' => array( 'api-key' => OB_BREVO_API_KEY, 'Content-Type' => 'application/json', 'Accept' => 'application/json' ),
			'body'    => wp_json_encode( array(
				'sender'      => array( 'name' => OB_MAIL_FROM_NAME, 'email' => ob_mail_from() ),
				'to'          => array( $recipient ),
				'subject'     => $subject,
				'htmlContent' => $html,
				'tags'        => array( 'orthobedroom-signup' ),
			) ),
		) );
		$code = is_wp_error( $response ) ? 0 : (int) wp_remote_retrieve_response_code( $response );
		if ( $code >= 200 && $code < 300 ) {
			return true;
		}
		error_log( 'OrthoBedroom Brevo email failed (' . $code . '): ' . ( is_wp_error( $response ) ? $response->get_error_message() : wp_remote_retrieve_body( $response ) ) );
		return false;
	}
	return wp_mail( $to, $subject, $html, array( 'Content-Type: text/html; charset=UTF-8', 'From: ' . OB_MAIL_FROM_NAME . ' <' . ob_mail_from() . '>' ) );
}

/** Adds a CONFIRMED subscriber to the Brevo list (marketing emails go to this list only). */
function ob_brevo_subscribe( $email, $first_name ) {
	if ( ! defined( 'OB_BREVO_API_KEY' ) || ! OB_BREVO_API_KEY || ! defined( 'OB_BREVO_LIST_ID' ) || ! OB_BREVO_LIST_ID ) {
		return false;
	}
	$contact = array( 'email' => $email, 'listIds' => array( (int) OB_BREVO_LIST_ID ), 'updateEnabled' => true );
	if ( '' !== (string) $first_name ) {
		$contact['attributes'] = array( 'FIRSTNAME' => $first_name );
	}
	$response = wp_remote_post( 'https://api.brevo.com/v3/contacts', array(
		'timeout' => 15,
		'headers' => array( 'api-key' => OB_BREVO_API_KEY, 'Content-Type' => 'application/json', 'Accept' => 'application/json' ),
		'body'    => wp_json_encode( $contact ),
	) );
	$code = is_wp_error( $response ) ? 0 : (int) wp_remote_retrieve_response_code( $response );
	if ( $code >= 200 && $code < 300 ) {
		return true;
	}
	error_log( 'OrthoBedroom Brevo contact failed (' . $code . '): ' . ( is_wp_error( $response ) ? $response->get_error_message() : wp_remote_retrieve_body( $response ) ) );
	return false;
}

/** Simple branded email wrapper. */
function ob_email_html( $first_name, $paragraphs_html ) {
	$hello = $first_name ? sprintf( 'Hi %s,', esc_html( $first_name ) ) : 'Hi,';
	return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1a2e44;max-width:560px">'
		. '<p>' . $hello . '</p>' . $paragraphs_html
		. '<p style="color:#5b6b80;font-size:13px">OrthoBedroom.co.uk</p></div>';
}

function ob_send_confirmation_email( $email, $first_name, $token ) {
	$link   = OB_SITE_URL . '/confirm-email/?token=' . rawurlencode( $token );
	$button = '<p><a href="' . esc_url( $link ) . '" style="display:inline-block;padding:14px 26px;border-radius:8px;background:#1557a7;color:#ffffff;font-weight:700;text-decoration:none">Confirm my email</a></p>';
	$html   = ob_email_html( $first_name,
		'<p>Thanks for signing up to OrthoBedroom emails. Please confirm your email address to complete your subscription and get your <strong>' . OB_SIGNUP_PERCENT . '% welcome code</strong>.</p>'
		. $button
		. '<p style="font-size:14px;color:#5b6b80">Or copy this link into your browser:<br>' . esc_html( $link ) . '</p>'
		. '<p style="font-size:14px;color:#5b6b80">The link works for ' . (int) OB_CONFIRM_LINK_DAYS . ' days. If you didn\'t sign up, you can ignore this email and you won\'t be subscribed.</p>'
	);
	return ob_mail( $email, $first_name, 'Please confirm your email address - OrthoBedroom', $html );
}

function ob_send_signup_email( $email, $first_name, $code, $expires_label ) {
	$html = ob_email_html( $first_name,
		'<p>Your email is confirmed - welcome to OrthoBedroom. Here is your welcome code for <strong>' . OB_SIGNUP_PERCENT . '% off your first order</strong>:</p>'
		. '<p style="font-size:22px;font-weight:700;letter-spacing:1px">' . esc_html( strtoupper( $code ) ) . '</p>'
		. '<p>Enter it at checkout. It can be used once, on your first order, and cannot be combined with other codes.'
		. ( $expires_label ? ' It expires on ' . esc_html( $expires_label ) . '.' : '' ) . '</p>'
		. '<p><a href="' . esc_url( OB_SITE_URL . '/collections/bedroom/mattresses/' ) . '">Shop mattresses</a></p>'
	);
	return ob_mail( $email, $first_name, sprintf( 'Your %d%% welcome code from OrthoBedroom.co.uk', OB_SIGNUP_PERCENT ), $html );
}

/** The welcome code for an email (existing or new). */
function ob_signup_coupon_for( $email, $first_name ) {
	$coupon = ob_find_signup_coupon( $email );
	if ( $coupon ) {
		return $coupon;
	}
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
	return $coupon;
}

function ob_signup_row( $email ) {
	global $wpdb;
	return $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . ob_signups_table() . ' WHERE email = %s', $email ), ARRAY_A );
}

/* ── Sign-up endpoint (step 1: sends the confirmation email) ── */

/**
 * POST /wp-json/orthobedroom/v1/signup  { email, first_name?, website? (honeypot), turnstile? }
 * Returns { ok, pending, message }. No code is given until the email address is confirmed.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'orthobedroom/v1', '/signup', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$check_inbox = function ( $email ) {
				return rest_ensure_response( array(
					'ok'      => true,
					'pending' => true,
					'message' => 'Almost there! We\'ve sent a confirmation email to ' . $email . '. Click the link in it to confirm your subscription and get your welcome code. If you can\'t see it, check your spam or junk folder.',
				) );
			};

			// Honeypot: real visitors never fill this hidden field. Pretend success to bots.
			if ( '' !== trim( (string) $request->get_param( 'website' ) ) ) {
				return $check_inbox( 'your email address' );
			}
			if ( ! ob_turnstile_ok( $request->get_param( 'turnstile' ) ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Our security check failed. Please refresh the page and try again.' ), 403 );
			}

			$email      = strtolower( sanitize_email( (string) $request->get_param( 'email' ) ) );
			$first_name = mb_substr( sanitize_text_field( (string) $request->get_param( 'first_name' ) ), 0, 40 );
			if ( strlen( $email ) > 254 || ! is_email( $email ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Please enter a valid email address.' ), 400 );
			}

			// Spam guard: limit sign-ups per visitor IP per hour.
			if ( ob_rate_limited( 'signup', OB_SIGNUP_MAX_PER_HOUR ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Too many sign-ups. Please try again later.' ), 429 );
			}

			ob_save_signup( $email, $first_name );
			$row = ob_signup_row( $email );

			// Already confirmed: nothing more to do.
			if ( $row && ! empty( $row['confirmed_at'] ) ) {
				return rest_ensure_response( array( 'ok' => true, 'pending' => false, 'message' => "You're already subscribed - thank you! Your welcome code was sent when you confirmed your email." ) );
			}

			// Don't send another confirmation email to the same address within a few minutes.
			if ( $row && ! empty( $row['confirm_sent_at'] ) && strtotime( $row['confirm_sent_at'] . ' UTC' ) > time() - OB_CONFIRM_RESEND_MINUTES * MINUTE_IN_SECONDS ) {
				return $check_inbox( $email );
			}

			$token = wp_generate_password( 32, false, false );
			global $wpdb;
			$wpdb->update( ob_signups_table(), array(
				'confirm_token'   => hash( 'sha256', $token ),
				'confirm_sent_at' => current_time( 'mysql', true ),
			), array( 'email' => $email ) );

			if ( ! ob_send_confirmation_email( $email, $first_name ? $first_name : ( $row['first_name'] ?? '' ), $token ) ) {
				// Let them try again straight away.
				$wpdb->update( ob_signups_table(), array( 'confirm_sent_at' => null ), array( 'email' => $email ) );
				return new WP_REST_Response( array( 'ok' => false, 'message' => "Sorry, we couldn't send the confirmation email right now. Please try again in a few minutes." ), 500 );
			}
			return $check_inbox( $email );
		},
	) );
} );

/* ── Confirm endpoint (step 2: the link in the email) ── */

/**
 * POST /wp-json/orthobedroom/v1/confirm  { token }
 * Confirms the email, adds it to the Brevo list and returns { ok, message } plus { code, percent, expires }.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'orthobedroom/v1', '/confirm', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$invalid = new WP_REST_Response( array( 'ok' => false, 'message' => 'This confirmation link is not valid or has expired. Please sign up again to get a new link.' ), 400 );
			$token   = (string) $request->get_param( 'token' );
			if ( ! preg_match( '/^[A-Za-z0-9]{32}$/', $token ) ) {
				return $invalid;
			}
			if ( ob_rate_limited( 'confirm', 30 ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => 'Too many attempts. Please try again later.' ), 429 );
			}

			global $wpdb;
			$table = ob_signups_table();
			$row   = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE confirm_token = %s", hash( 'sha256', $token ) ), ARRAY_A );
			if ( ! $row || empty( $row['confirm_sent_at'] ) ) {
				return $invalid;
			}
			$first_time = empty( $row['confirmed_at'] );
			if ( $first_time && strtotime( $row['confirm_sent_at'] . ' UTC' ) < time() - OB_CONFIRM_LINK_DAYS * DAY_IN_SECONDS ) {
				return $invalid;
			}

			$email      = $row['email'];
			$first_name = $row['first_name'];
			if ( $first_time ) {
				$wpdb->update( $table, array( 'confirmed_at' => current_time( 'mysql', true ), 'updated_at' => current_time( 'mysql', true ) ), array( 'id' => $row['id'] ) );
			}
			if ( empty( $row['brevo_synced'] ) && ob_brevo_subscribe( $email, $first_name ) ) {
				$wpdb->update( $table, array( 'brevo_synced' => 1 ), array( 'id' => $row['id'] ) );
			}

			// Existing customers are subscribed but get no first-order code.
			if ( ob_has_previous_order( $email ) ) {
				return rest_ensure_response( array( 'ok' => true, 'message' => "Your email is confirmed and you're subscribed. Thank you!" ) );
			}

			$coupon = ob_signup_coupon_for( $email, $first_name );
			ob_save_signup( $email, $first_name, $coupon );
			$expires = $coupon->get_date_expires();
			if ( $coupon->get_usage_count() >= max( 1, (int) $coupon->get_usage_limit() ) ) {
				return rest_ensure_response( array( 'ok' => true, 'message' => "Your email is confirmed. You've already used your welcome code on an order." ) );
			}
			if ( $expires && $expires->getTimestamp() < time() ) {
				return rest_ensure_response( array( 'ok' => true, 'message' => 'Your email is confirmed. The welcome code for this email has expired.' ) );
			}
			if ( $first_time ) {
				$expires_label = $expires ? wp_date( 'j F Y', $expires->getTimestamp() ) : '';
				ob_send_signup_email( $email, $first_name, $coupon->get_code(), $expires_label );
			}
			return rest_ensure_response( array(
				'ok'      => true,
				'message' => "Your email is confirmed and you're subscribed. Here's your welcome code - we've emailed it to you too.",
				'code'    => strtoupper( $coupon->get_code() ),
				'percent' => OB_SIGNUP_PERCENT,
				'expires' => $expires ? wp_date( 'Y-m-d', $expires->getTimestamp() ) : null,
			) );
		},
	) );
} );
