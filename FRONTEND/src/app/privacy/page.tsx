import { Metadata } from 'next';
import Link from 'next/link';
import { BiShieldAlt, BiLock, BiCookie, BiUserCircle, BiEnvelope } from 'react-icons/bi';
import { FaDatabase, FaMusic, FaChild, FaSync } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Privacy Policy - Groovia',
    description: 'Privacy Policy for Groovia music streaming platform. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
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
                    <BiLock className="text-6xl text-purple-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Privacy Policy
                </h1>
                <p className="text-gray-400 text-lg">
                    Your Privacy, Our Commitment
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
                        Groovia respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how information is collected, used, and protected when you access or use our website and services.
                    </p>
                    <p className="text-gray-400 text-sm italic">
                        <strong className="text-purple-400">By using Groovia, you agree to the practices described in this policy.</strong>
                    </p>
                </div>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaDatabase className="text-purple-500" />
                    Information We Collect
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-6">
                    <p className="text-gray-300 leading-relaxed">
                        We collect only the <span className="text-purple-400 font-semibold">minimum information required</span> to operate the platform.
                    </p>

                    {/* Account Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BiUserCircle className="text-purple-400" />
                            1. Account Information
                        </h3>
                        <p className="text-sm text-gray-400">
                            When you create an account, we may collect:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300 ml-6">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Email address</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Username or display name</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Encrypted password</span>
                            </li>
                        </ul>
                        <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 mt-3">
                            <p className="text-sm text-gray-300">
                                This information is used only to provide account access, save playlists, and enable future platform features such as user uploads.
                            </p>
                            <p className="text-sm text-purple-400 font-semibold mt-2">
                                We do not collect payment information.
                            </p>
                        </div>
                    </div>

                    {/* Usage Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FaDatabase className="text-purple-400 text-sm" />
                            2. Usage Information
                        </h3>
                        <p className="text-sm text-gray-400">
                            We may automatically collect limited technical data such as:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300 ml-6">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>IP address (for security and abuse prevention)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Browser and device type</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Basic activity logs for system stability</span>
                            </li>
                        </ul>
                        <p className="text-sm text-gray-400 italic mt-2">
                            This data does not personally identify you.
                        </p>
                    </div>
                </div>
            </section>

            {/* How We Use Your Information */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiShieldAlt className="text-purple-500" />
                    How We Use Your Information
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300">
                        Your information is used to:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>Create and manage your account</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>Save and sync playlists</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>Improve platform reliability and security</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>Communicate important service updates (if required)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>Respond to support or legal requests</span>
                        </li>
                    </ul>
                    <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg p-4 mt-4">
                        <p className="text-purple-400 font-semibold text-sm">
                            We do not sell, rent, or share personal data with third parties.
                        </p>
                    </div>
                </div>
            </section>

            {/* Third-Party Music Sources */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaMusic className="text-purple-500" />
                    Third-Party Music Sources
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        <span className="font-semibold text-purple-400">Groovia does not host, upload, or store any audio files on its servers.</span> All streaming and download content is provided by third-party sources publicly available on the internet.
                    </p>
                    <div className="bg-amber-950/20 border border-amber-600/40 rounded-lg p-4">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            When accessing external content, you are subject to the privacy policies and terms of those third-party websites. <strong className="text-amber-400">Groovia is not responsible for their practices or content.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* Cookies */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiCookie className="text-purple-500" />
                    Cookies
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia may use <span className="text-purple-400 font-semibold">essential cookies</span> to maintain login sessions and platform functionality. No advertising or tracking cookies are used.
                    </p>
                    <p className="text-sm text-gray-400">
                        You can control cookies through your browser settings.
                    </p>
                </div>
            </section>

            {/* Data Security */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiLock className="text-purple-500" />
                    Data Security
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        We implement reasonable security measures to protect user data. However, no online platform can guarantee absolute security.
                    </p>
                    <p className="text-sm text-gray-400 italic">
                        Users access the service at their own risk.
                    </p>
                </div>
            </section>

            {/* Children's Privacy */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaChild className="text-purple-500" />
                    Children's Privacy
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia does not knowingly collect personal information from children under the age of 13. If such data is discovered, it will be removed promptly.
                    </p>
                </div>
            </section>

            {/* Changes to Policy */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaSync className="text-purple-500" />
                    Changes to This Policy
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        We may update this Privacy Policy occasionally. Updates will be posted on this page with a revised effective date.
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
                        For privacy-related questions or concerns, contact us at:
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
                        href="/terms"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        Terms of Service
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
