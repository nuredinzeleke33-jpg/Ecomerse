import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="w-full bg-gradient-to-t from-gray-200/80 via-white/90 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800 mt-10">
			<div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Brand & Newsletter */}
				<div>
					<div className="flex items-center gap-2 mb-2">
						<span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">Nurye Shope</span>
					</div>
					<p className="text-sm mb-4">Your one-stop shop for quality products and great deals. Join our newsletter for updates!</p>
					<form className="flex items-center gap-2">
						<input
							type="email"
							placeholder="Your email"
							className="rounded-l px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
							aria-label="Email address"
						/>
						<button
							type="submit"
							className="rounded-r px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
						>
							Subscribe
						</button>
					</form>
				</div>

				{/* Navigation */}
				<div>
					<h3 className="font-bold mb-3 text-lg">Navigation</h3>
					<ul className="space-y-2">
						<li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
						<li><Link href="/shope" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shope</Link></li>
						<li><Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Products</Link></li>
						<li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
						<li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
					</ul>
				</div>

				{/* Useful Links */}
				<div>
					<h3 className="font-bold mb-3 text-lg">Useful Links</h3>
					<ul className="space-y-2">
						<li><Link href="/profile" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Account</Link></li>
						<li><Link href="/cart" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cart</Link></li>
						<li><Link href="/wishlist" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Wishlist</Link></li>
						<li><Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link></li>
						<li><Link href="/support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</Link></li>
					</ul>
				</div>

				{/* Social & Copyright */}
				<div className="flex flex-col h-full justify-between">
					<div>
						<h3 className="font-bold mb-3 text-lg">Follow Us</h3>
						<div className="flex space-x-4 mb-4">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
								className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors"
							>
								<FaFacebookF className="text-xl" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-blue-400 hover:text-white dark:hover:bg-blue-400 transition-colors"
							>
								<FaTwitter className="text-xl" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 transition-colors"
							>
								<FaInstagram className="text-xl" />
							</a>
						</div>
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
						&copy; {new Date().getFullYear()} Nurye Shope. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
