import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Trustless Credit DAO</h3>
                        <p className="text-gray-600">
                            Decentralized lending powered by AI and blockchain technology.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600">
                                    Apply for Loan
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600">
                                    My Loans
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-600">
                                Email: support@trustlesscreditdao.com
                            </li>
                            <li className="text-gray-600">
                                Discord: discord.gg/trustlesscreditdao
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Trustless Credit DAO. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 