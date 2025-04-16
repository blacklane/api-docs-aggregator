import type React from "react";

interface LogoProps {
	className?: string;
	width?: number;
	height?: number;
	title?: string;
}

export const Logo: React.FC<LogoProps> = ({
	className = "",
	width = 170,
	height = 20,
	title = "Brand Logo",
}) => {
	return (
		<div className="flex items-center gap-2 text-white">
			<svg
				width={width}
				height={height}
				viewBox="0 0 170 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
				aria-labelledby="logoTitle"
				role="img"
			>
				<title id="logoTitle">{title}</title>
				<mask
					id="mask0_285_3141"
					style={{ maskType: "alpha" }}
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="17"
					height="20"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 0.331543H16.6975V19.6684H0V0.331543Z"
						fill="white"
					/>
				</mask>
				<g mask="url(#mask0_285_3141)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12.4041 13.8398C12.4041 15.2763 11.2534 15.9394 9.34515 15.9394H4.20954V11.6852H9.20471C11.4215 11.6852 12.4041 12.4863 12.4041 13.7845V13.8398ZM4.20954 4.06085H8.47509C10.2991 4.06085 11.3094 4.77906 11.3094 6.0497V6.10477C11.3094 7.54119 10.1027 8.14925 8.19448 8.14925H4.20954V4.06085ZM13.0216 9.55784C14.4246 8.78456 15.6032 7.56899 15.6032 5.38655V5.33147C15.6032 4.00576 15.1542 2.92817 14.2562 2.04418C13.1338 0.939323 11.3657 0.331543 9.12056 0.331543H0V19.6684H9.34521C13.7792 19.6684 16.6977 17.9007 16.6977 14.3647V14.3094C16.6977 11.7127 15.2947 10.4146 13.0216 9.55784Z"
						fill="currentColor"
					/>
				</g>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M24.064 0.331421H19.7422V19.6686H33.2733V15.801H24.064V0.331421Z"
					fill="currentColor"
				/>
				<mask
					id="mask1_285_3141"
					style={{ maskType: "alpha" }}
					maskUnits="userSpaceOnUse"
					x="155"
					y="0"
					width="15"
					height="20"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M155.042 0.331421H170V19.6683H155.042V0.331421Z"
						fill="white"
					/>
				</mask>
				<g mask="url(#mask1_285_3141)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M159.336 15.8839V11.8231H168.597V8.03868H159.336V4.11579H169.86V0.331421H155.042V19.6683H170V15.8839H159.336Z"
						fill="currentColor"
					/>
				</g>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M119.106 11.5747L121.716 5.30385L124.326 11.5747H119.106ZM119.78 0.193481L111.36 19.6686H115.766L117.562 15.3315H125.869L127.665 19.6686H132.183L123.764 0.193481H119.78Z"
					fill="currentColor"
				/>
				<mask
					id="mask2_285_3141"
					style={{ maskType: "alpha" }}
					maskUnits="userSpaceOnUse"
					x="55"
					y="0"
					width="20"
					height="20"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M55.9399 0H74.0689V20H55.9399V0Z"
						fill="white"
					/>
				</mask>
				<g mask="url(#mask2_285_3141)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M66.1549 16.0774C62.7874 16.0774 60.4581 13.315 60.4581 9.99986V9.94479C60.4581 6.62995 62.8434 3.92289 66.1549 3.92289C68.1194 3.92289 69.6629 4.75126 71.1781 6.10478L73.9284 2.98355C72.1044 1.21528 69.8872 0 66.1832 0C60.1493 0 55.9399 4.50286 55.9399 9.99986V10.0555C55.9399 15.6079 60.2337 20.0003 66.0148 20.0003C69.803 20.0003 72.0481 18.674 74.0689 16.5469L71.3185 13.812C69.7753 15.1934 68.4 16.0774 66.1549 16.0774Z"
						fill="currentColor"
					/>
				</g>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M147.375 12.2377L138.17 0.331299H134.185V19.6684H138.451V7.37571L147.964 19.6684H151.641V0.331299H147.375V12.2377Z"
					fill="currentColor"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M100.301 0.331421H95.9795V19.6686H109.511V15.801H100.301V0.331421Z"
					fill="currentColor"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M93.8362 0.331421H88.6164L80.6465 8.78471V0.331421H76.3247V19.6686H80.6465V13.7571L82.9196 11.4364L89.0094 19.6686H94.201L85.8381 8.53576L93.8362 0.331421Z"
					fill="currentColor"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M43.5359 0.193481L35.1167 19.6686H39.523L41.3188 15.3312H49.6258L51.4216 19.6686H55.94L47.5208 0.193481H43.5359ZM45.4725 5.30385L48.0821 11.5747H42.8626L45.4725 5.30385Z"
					fill="currentColor"
				/>
			</svg>
		</div>
	);
};
