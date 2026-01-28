import { Metadata } from 'next';
import Link from 'next/link';
import { BiFile, BiUser, BiCloudUpload, BiShieldAlt, BiBlock, BiLink, BiEnvelope } from 'react-icons/bi';
import { FaExclamationTriangle, FaCheckCircle, FaSync, FaTelegram } from 'react-icons/fa';
import { MdWarning, MdGavel } from 'react-icons/md';

export const metadata: Metadata = {
    title: 'Terms of Service - Groovia',
    description: 'Terms of Service and user agreement for Groovia music streaming platform.',
};

export default function TermsPage() {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 pb-6 border-b border-zinc-800">
                <div className="flex justify-center">
                    <BiFile className="text-6xl text-purple-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Terms of Service
                </h1>
                <p className="text-gray-400 text-lg">
                    User Agreement & Platform Rules
                </p>
            </div>

            {/* Effective Date */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                    <span className="font-semibold text-white">Effective Date:</span> {currentDate}
                </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
                <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-900/30 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Welcome to Groovia. By accessing or using this website, you agree to comply with and be bound by these Terms of Service.
                    </p>
                    <p className="text-purple-400 font-semibold text-sm">
                        If you do not agree with any part of these terms, please do not use the platform.
                    </p>
                </div>
            </section>

            {/* Clone/Duplicate Website Warning - IMPORTANT */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaExclamationTriangle className="text-amber-500" />
                    ⚠️ Official Domain & Clone Warning
                </h2>
                <div className="bg-red-950/30 border-2 border-red-600/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <MdWarning className="text-red-500 text-3xl flex-shrink-0 mt-1" />
                        <div className="space-y-3">
                            <p className="text-gray-200 font-semibold text-lg">
                                Warning: Beware of Clone/Duplicate Websites!
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Multiple clone or duplicate websites may appear in the market claiming to be Groovia. These fake websites may:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Steal your personal information or credentials</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Distribute malware or harmful software</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Provide poor or malicious service</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Operate scams or fraudulent schemes</span>
                                </li>
                            </ul>
                            <div className="bg-zinc-950 border border-red-800 rounded-lg p-4 mt-4 space-y-3">
                                <p className="text-red-400 font-bold text-sm">
                                    🚨 IMPORTANT DISCLAIMER:
                                </p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Groovia and Univora are <strong className="text-white">NOT RESPONSIBLE</strong> for any damages, data loss, security breaches, or issues caused by using clone or fake websites. Use such sites at your own risk.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Official Sources */}
                    <div className="bg-green-950/20 border border-green-600/40 rounded-lg p-5 mt-4 space-y-4">
                        <p className="text-green-400 font-semibold flex items-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            How to Verify the Official Groovia Domain:
                        </p>
                        <div className="space-y-3">
                            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-2">📍 Check Official Domain Updates:</p>
                                <a
                                    href="https://univora.site"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 text-lg font-semibold transition-colors"
                                >
                                    univora.site
                                </a>
                                <p className="text-xs text-gray-500 mt-2">
                                    Visit our parent platform for official domain information
                                </p>
                            </div>

                            <div className="bg-blue-950/20 border border-blue-600/40 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <FaTelegram className="text-blue-400" />
                                    Join Our Official Telegram Channel:
                                </p>
                                <a
                                    href="https://t.me/+aAGIRpHjBVdkNGJl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm font-mono transition-colors break-all"
                                >
                                    t.me/+aAGIRpHjBVdkNGJl
                                </a>
                                <p className="text-xs text-gray-500 mt-2">
                                    Get real-time updates about domain changes and official announcements
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 italic mt-3">
                            Always verify the domain before entering personal information or using the service.
                        </p>
                    </div>
                </div>
            </section>

            {/* Service Description */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MdGavel className="text-purple-500" />
                    Service Description
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia is a <span className="text-purple-400 font-semibold">free music discovery and streaming platform</span> that indexes and provides access to publicly available third-party music sources on the internet.
                    </p>
                    <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-purple-400 font-semibold">Important:</p>
                        <p className="text-sm text-gray-300">
                            Groovia does <strong>not host, store, upload, or control</strong> any audio content on its own servers.
                        </p>
                    </div>
                    <p className="text-sm text-gray-400">
                        Groovia provides users with tools to create playlists, save favorites, and access external music sources.
                    </p>
                </div>
            </section>

            {/* User Accounts */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiUser className="text-purple-500" />
                    User Accounts
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        To access certain features such as playlist creation and future upload functionality, users may create an account.
                    </p>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-400 font-semibold">You agree to:</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">✓</span>
                                <span>Provide accurate account information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">✓</span>
                                <span>Keep your login credentials secure</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">✓</span>
                                <span>Be responsible for all activity under your account</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-sm text-gray-400 italic">
                        Groovia reserves the right to suspend or terminate accounts that violate these terms.
                    </p>
                </div>
            </section>

            {/* User Content */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiCloudUpload className="text-purple-500" />
                    User Content (Future Uploads)
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300">
                        If user upload features are enabled in the future:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>You retain ownership of any content you upload</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>You confirm that you have legal rights to upload such content</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>You agree not to upload copyrighted or illegal material without authorization</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>Groovia reserves the right to remove content that violates laws or platform policies</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Copyright & DMCA */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiShieldAlt className="text-purple-500" />
                    Copyright & DMCA
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia respects intellectual property rights. If you believe your copyrighted content has been indexed or linked improperly, you may submit a DMCA request according to our{' '}
                        <Link href="/dmca" className="text-purple-400 hover:text-purple-300 transition-colors underline">
                            DMCA Policy
                        </Link>.
                    </p>
                    <p className="text-sm text-gray-400">
                        Groovia will remove infringing links where technically feasible.
                    </p>
                </div>
            </section>

            {/* Prohibited Use */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiBlock className="text-red-500" />
                    Prohibited Use
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300">Users agree not to:</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Use Groovia for illegal purposes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Attempt to hack, abuse, overload, or disrupt the platform</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Scrape, copy, or misuse platform data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Upload malicious software or harmful content</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Bypass security or access restrictions</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Third-Party Links */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiLink className="text-purple-500" />
                    Third-Party Links
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia contains links to external websites. We do not control or endorse third-party content, services, or privacy practices. <span className="text-amber-400 font-semibold">Users access third-party platforms at their own risk.</span>
                    </p>
                </div>
            </section>

            {/* Disclaimer of Warranties */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MdWarning className="text-amber-500" />
                    Disclaimer of Warranties
                </h2>
                <div className="bg-amber-950/20 border border-amber-600/40 rounded-lg p-6 space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia is provided <span className="text-amber-400 font-semibold">"as is"</span> and <span className="text-amber-400 font-semibold">"as available"</span>. We make no guarantees regarding availability, accuracy, or uninterrupted service.
                    </p>
                    <p className="text-sm text-gray-400">
                        We are not responsible for content hosted on third-party platforms.
                    </p>
                </div>
            </section>

            {/* Limitation of Liability */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    Limitation of Liability
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia shall not be liable for any direct, indirect, or incidental damages arising from the use or inability to use the platform.
                    </p>
                </div>
            </section>

            {/* Termination */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    Termination
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        We reserve the right to suspend or terminate access to the platform at any time without prior notice for violations of these terms.
                    </p>
                </div>
            </section>

            {/* Changes to Terms */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaSync className="text-purple-500" />
                    Changes to Terms
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia may update these Terms of Service at any time. Continued use of the platform indicates acceptance of updated terms.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiEnvelope className="text-purple-500" />
                    Contact Information
                </h2>
                <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-900/30 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300">
                        For questions related to these Terms, contact us at:
                    </p>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                        <p className="text-purple-400 font-mono text-lg">
                            univora8@gmail.com
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Links */}
            <div className="pt-8 border-t border-zinc-800">
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/dmca"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        DMCA Policy
                    </Link>
                    <span className="text-gray-700">•</span>
                    <Link
                        href="/privacy"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <span className="text-gray-700">•</span>
                    <Link
                        href="/disclaimer"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        Disclaimer
                    </Link>
                    <span className="text-gray-700">•</span>
                    <Link
                        href="/"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
                <p className="text-gray-400 text-sm">
                    Groovia is a platform by{' '}
                    <a
                        href="https://univora.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        Univora
                    </a>
                </p>
            </div>
        </div>
    );
}
