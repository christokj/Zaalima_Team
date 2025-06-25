import { Link } from 'react-router-dom';

const Footer = () => {
    const handleOnClickFacebook = () => {
        window.open('https://m.facebook.com/profile.php/?id=100011657233419', '_blank');
    };

    const handleOnClickTwitter = () => {
        window.open('https://twitter.com/christokj1', '_blank');
    };

    return (
        <section className="bg-transparent text-white pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10 pb-14">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h6 className="text-lg font-semibold">Contact Us</h6>
                        <p className="text-sm text-white/70">Thrissur, Kerala, India</p>
                        <p className="text-sm text-white/70">+91 6282130289</p>
                        <p className="text-sm text-white/70">support@trendiq.com</p>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h6 className="text-lg font-semibold">Newsletter</h6>
                        <p className="text-sm text-white/70">Stay in the loop with our latest updates.</p>
                        <form className="relative w-full max-w-sm">
                            <input
                                type="email"
                                placeholder="   Your email"
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2 pr-28 rounded-lg placeholder:text-white/60 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h6 className="text-lg font-semibold">Quick Links</h6>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link to="/products" className="hover:text-white">Products</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 my-4">
                    <p className="text-xs text-white/60">© <Link to="/" className="hover:text-white">Trendiq</Link> 2024. All rights reserved.</p>

                    <ul className="flex gap-6 text-sm text-white/60">
                        <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                        <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                        <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
                    </ul>

                    <div className="flex gap-4">
                        <button
                            onClick={handleOnClickFacebook}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-blue-600 transition"
                        >
                            <svg
                                className="relative z-10 fill-white  transition-all duration-300 group-hover:fill-white group-focus-within:fill-white"
                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 72 72" fill="none">
                                <path
                                    d="M46.4927 38.6403L47.7973 30.3588H39.7611V24.9759C39.7611 22.7114 40.883 20.4987 44.4706 20.4987H48.1756V13.4465C46.018 13.1028 43.8378 12.9168 41.6527 12.8901C35.0385 12.8901 30.7204 16.8626 30.7204 24.0442V30.3588H23.3887V38.6403H30.7204V58.671H39.7611V38.6403H46.4927Z"
                                    fill=""></path>
                            </svg>
                        </button>
                        <button
                            onClick={handleOnClickTwitter}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-sky-500 transition"
                        >
                            <svg
                                className="fill-white z-10 transition-all duration-300 group-hover:fill-white group-focus-within:fill-white"
                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 72 72" fill="none">
                                <path
                                    d="M40.7568 32.1716L59.3704 11H54.9596L38.7974 29.383L25.8887 11H11L30.5205 38.7983L11 61H15.4111L32.4788 41.5869L46.1113 61H61L40.7557 32.1716H40.7568ZM34.7152 39.0433L32.7374 36.2752L17.0005 14.2492H23.7756L36.4755 32.0249L38.4533 34.7929L54.9617 57.8986H48.1865L34.7152 39.0443V39.0433Z"
                                    fill=""></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Footer;
