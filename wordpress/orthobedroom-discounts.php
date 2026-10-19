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
 *    emailed to them, 10% off the current (sale) price, one use, first order only (checked at checkout).
 *    Never combinable with other codes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'OB_PARTNER_PREFIX' ) ) {
	define( 'OB_PARTNER_PREFIX', 'partner-' );     // marketer codes (case-insensitive)
	define( 'OB_SIGNUP_PREFIX', 'welcome-' );      // sign-up codes (case-insensitive)
	define( 'OB_SIGNUP_PERCENT', 10 );             // sign-up discount, % of the sale price
	define( 'OB_SIGNUP_EXPIRY_DAYS', 0 );          // 0 = never expires; e.g. 30 = expires after 30 days
	define( 'OB_SIGNUP_MAX_PER_HOUR', 5 );         // sign-ups allowed per visitor IP per hour (spam guard)
	define( 'OB_SITE_URL', 'https://www.orthobedroom.co.uk' );
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

function ob_send_signup_email( $email, $first_name, $code ) {
	$hello   = $first_name ? sprintf( 'Hi %s,', esc_html( $first_name ) ) : 'Hi,';
	$subject = sprintf( 'Your %d%% welcome code from OrthoBedroom.co.uk', OB_SIGNUP_PERCENT );
	$body    = '<p>' . $hello . '</p>'
		. '<p>Thanks for signing up. Here is your welcome code for <strong>' . OB_SIGNUP_PERCENT . '% off your first order</strong>:</p>'
		. '<p style="font-size:22px;font-weight:700;letter-spacing:1px">' . esc_html( strtoupper( $code ) ) . '</p>'
		. '<p>Enter it in your basket or at checkout. It can be used once, on your first order, and cannot be combined with other codes.</p>'
		. '<p><a href="' . esc_url( OB_SITE_URL . '/collections/bedroom/mattresses/' ) . '">Shop orthopaedic mattresses</a></p>'
		. '<p>OrthoBedroom.co.uk</p>';
	return wp_mail( $email, $subject, $body, array( 'Content-Type: text/html; charset=UTF-8' ) );
}

/** POST /wp-json/orthobedroom/v1/signup  { email, first_name?, website? (honeypot) } */
add_action( 'rest_api_init', function () {
	register_rest_route( 'orthobedroom/v1', '/signup', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$ok = array( 'ok' => true, 'message' => 'Thanks! Check your inbox for your welcome code.' );

			// Honeypot: real visitors never fill this hidden field. Pretend success to bots.
			if ( '' !== trim( (string) $request->get_param( 'website' ) ) ) {
				return rest_ensure_response( $ok );
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

			// Existing customers don't get a first-order code.
			if ( ob_has_previous_order( $email ) ) {
				return rest_ensure_response( array( 'ok' => true, 'message' => "Thanks! You're signed up." ) );
			}

			// One code per email: re-send the existing one instead of creating another.
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

			if ( ! ob_send_signup_email( $email, $first_name, $coupon->get_code() ) ) {
				return new WP_REST_Response( array( 'ok' => false, 'message' => "We couldn't send the email right now. Please try again shortly." ), 500 );
			}
			return rest_ensure_response( $ok );
		},
	) );
} );
