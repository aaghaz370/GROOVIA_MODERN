import { Metadata } from 'next';
import Link from 'next/link';
import { BiInfoCircle, BiEnvelope, BiError } from 'react-icons/bi';
import { FaExclamationTriangle, FaMusic, FaShieldAlt, FaSync, FaTelegram } from 'react-icons/fa';
import { MdWarning, MdSecurity } from 'react-icons/md';

export const metadata: Metadata = {
    title: 'Disclaimer - Groovia',
    description: 'Legal disclaimer and liability information for Groovia music streaming platform.',
};

export default function DisclaimerPage() {
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
                    <FaExclamationTriangle className="text-6xl text-amber-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Disclaimer
                </h1>
                <p className="text-gray-400 text-lg">
                    Important Legal Information & Limitations
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
                <div className="bg-amber-950/20 border border-amber-600/40 rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <BiInfoCircle className="text-amber-400 text-3xl flex-shrink-0 mt-1" />
                        <div className="space-y-3">
                            <p className="text-gray-200 font-semibold text-lg">
                                Groovia is an independent music discovery and streaming platform created for informational and entertainment purposes only.
                            </p>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                Please read this disclaimer carefully before using our services. By accessing Groovia, you acknowledge and accept all terms outlined below.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Nature */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaMusic className="text-purple-500" />
                    Platform Nature & Content
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        <span className="text-purple-400 font-semibold">Groovia does not host, store, upload, or control any audio files on its servers.</span> All music content available through the platform is indexed or referenced from publicly available third-party sources on the internet.
                    </p>
                    <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 space-y-3">
                        <p className="text-sm text-purple-400 font-semibold">Important Clarifications:</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>We do not claim ownership of any content</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>All trademarks, logos, and copyrights belong to their respective owners</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Content is sourced from publicly accessible internet sources</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>Groovia acts solely as an indexing and discovery platform</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* User Risk & External Content */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MdWarning className="text-amber-500" />
                    User Risk & External Content
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Users access external links and third-party content <span className="text-amber-400 font-semibold">at their own discretion and risk</span>. Groovia is not responsible for the availability, accuracy, legality, or quality of content hosted on external websites.
                    </p>
                    <div className="bg-amber-950/20 border border-amber-600/40 rounded-lg p-4">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Groovia is provided on an <span className="text-amber-400 font-semibold">"as is"</span> and <span className="text-amber-400 font-semibold">"as available"</span> basis. We make no warranties regarding uninterrupted availability, accuracy, reliability, or performance of the service.
                        </p>
                    </div>
                </div>
            </section>

            {/* Third-Party Responsibility */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiError className="text-red-500" />
                    Third-Party Responsibility
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 font-semibold">
                        Groovia is NOT responsible for:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Content hosted on third-party platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Download behavior or external website policies</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Copyright permissions granted by external sources</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Data collection practices of external websites</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Security vulnerabilities of third-party services</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Malicious content served by external platforms</span>
                        </li>
                    </ul>
                    <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 mt-4">
                        <p className="text-sm text-gray-400 italic">
                            Users are strongly advised to review the terms of service, privacy policies, and security measures of any third-party services they access through Groovia.
                        </p>
                    </div>
                </div>
            </section>

            {/* Clone/Duplicate Website Warning */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MdSecurity className="text-red-500" />
                    🚨 Clone / Duplicate Website Warning
                </h2>
                <div className="bg-red-950/30 border-2 border-red-600/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-red-500 text-3xl flex-shrink-0 mt-1" />
                        <div className="space-y-4">
                            <p className="text-gray-200 font-semibold text-lg">
                                Beware of Unauthorized Clone Websites!
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                There may be <span className="text-red-400 font-semibold">unauthorized websites, applications, or services</span> that imitate or clone Groovia. Such platforms are <span className="text-red-400 font-semibold">NOT affiliated with us</span> and may pose serious security, privacy, or legal risks.
                            </p>

                            <div className="bg-zinc-950 border-2 border-red-800 rounded-lg p-4 space-y-3">
                                <p className="text-red-400 font-bold text-sm flex items-center gap-2">
                                    <FaShieldAlt />
                                    CRITICAL DISCLAIMER:
                                </p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    <strong className="text-white">Groovia and Univora are NOT RESPONSIBLE</strong> for any damages, data loss, fraud, identity theft, financial loss, security breaches, malware infections, or any form of misuse that may occur from interacting with unofficial, clone, or duplicate platforms.
                                </p>
                                <p className="text-gray-400 text-xs italic mt-2">
                                    Users should always ensure they are accessing the official Groovia service through verified and trusted communication channels.
                                </p>
                            </div>

                            {/* Official Verification */}
                            <div className="bg-green-950/20 border border-green-600/40 rounded-lg p-5 mt-4 space-y-4">
                                <p className="text-green-400 font-semibold text-sm">
                                    ✓ How to Verify Official Groovia Domain:
                                </p>
                                <div className="space-y-3">
                                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                                        <p className="text-sm text-gray-400 mb-2">🌐 Official Domain Updates:</p>
                                        <a
                                            href="https://univora.site"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-400 hover:text-purple-300 text-lg font-semibold transition-colors"
                                        >
                                            univora.site
                                        </a>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Visit our parent platform for current official Groovia domain
                                        </p>
                                    </div>

                                    <div className="bg-blue-950/20 border border-blue-600/40 rounded-lg p-4">
                                        <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                            <FaTelegram className="text-blue-400" />
                                            Official Telegram Channel:
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
                                            Get instant updates about domain changes and security alerts
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 italic border-l-2 border-amber-600 pl-4 mt-4">
                                <strong className="text-amber-400">Safety Tip:</strong> Always verify the domain before entering personal information, creating an account, or downloading any files. If something seems suspicious, contact us through official channels first.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Responsibility */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaShieldAlt className="text-purple-500" />
                    User Responsibility
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300">
                        By using Groovia, you acknowledge that:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>You are responsible for your own actions and usage behavior</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>You understand that content availability depends on third-party sources</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>You accept any risks associated with accessing external services</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>You will verify the authenticity of the platform before use</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>You are solely responsible for compliance with your local laws</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>You understand Groovia's role as an indexing platform only</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* No Liability */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    Limitation of Liability
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Under no circumstances shall Groovia, its operators, affiliates (including Univora), or contributors be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Use or inability to use the service</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Unauthorized access to user data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Errors, viruses, or malicious code from third-party sources</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Content accuracy, legality, or availability</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Interaction with clone or unauthorized platforms</span>
                        </li>
                    </ul>
                    <p className="text-sm text-gray-400 italic mt-4">
                        This limitation applies even if Groovia has been advised of the possibility of such damages.
                    </p>
                </div>
            </section>

            {/* Updates to Disclaimer */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaSync className="text-purple-500" />
                    Updates to Disclaimer
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        This Disclaimer may be updated at any time without prior notice. Continued use of the platform indicates acceptance of the revised terms. We recommend reviewing this page periodically.
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
                        If you have questions regarding this Disclaimer, you may contact us at:
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
                        href="/terms"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        Terms of Service
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

            {/* Final Notice */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center space-y-2">
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
                <p className="text-gray-600 text-xs">
                    Use at your own risk • Verify authenticity • Stay safe online
                </p>
            </div>
        </div>
    );
}
