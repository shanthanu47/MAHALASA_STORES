import { assets, footerLinks } from "../assets/assets";
import { NavLink } from 'react-router-dom';

const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div className="md:w-1/3">
                    <img className="w-34 md:w-32" src={assets.logo} alt="logo" />
                    <p className="max-w-[410px] mt-6">
                        Mahalasa Stores - We deliver fresh groceries and daily essentials straight to your door. Trusted by the community, we aim to make your shopping experience simple and affordable.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-2/3 gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index} className="min-w-[150px]">
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        {link.url.startsWith('/') ? (
                                            <NavLink 
                                                to={link.url} 
                                                className="hover:underline hover:text-primary transition"
                                            >
                                                {link.text}
                                            </NavLink>
                                        ) : (
                                            <a 
                                                href={link.url} 
                                                className="hover:underline hover:text-primary transition"
                                                target={link.url.startsWith('http') ? '_blank' : '_self'}
                                                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            >
                                                {link.text}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-6 text-center">
                <p className="text-sm md:text-base text-gray-600 mb-2">
                    <span className="font-semibold text-primary">Mahalasa Stores</span> - Your trusted local grocery partner
                </p>
                <p className="text-xs text-gray-500">
                    Store Location: Karjat, Udupi District, Karnataka - 576112 | Operating Hours: 7:00 AM - 11:00 PM
                </p>
            </div>
        </div>
    );
};

export default Footer