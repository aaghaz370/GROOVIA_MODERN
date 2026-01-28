import { Metadata } from 'next';
import Link from 'next/link';
import { BiInfoCircle, BiEnvelope, BiShieldAlt } from 'react-icons/bi';
import { FaExclamationTriangle } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'DMCA Policy - Groovia',
    description: 'Digital Millennium Copyright Act (DMCA) compliance and takedown policy for Groovia music platform.',
};

export default function DMCAPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 pb-6 border-b border-zinc-800">
                <div className="flex justify-center">
                    <BiShieldAlt className="text-6xl text-purple-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    DMCA Policy
                </h1>
                <p className="text-gray-400 text-lg">
                    Digital Millennium Copyright Act Compliance
                </p>
            </div>

            {/* Last Updated */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                    <span className="font-semibold text-white">Last Updated:</span> January 28, 2026
                </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiInfoCircle className="text-purple-500" />
                    Copyright Respect & User Responsibility
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia respects the intellectual property rights of content owners and expects its users to do the same. We are committed to complying with the Digital Millennium Copyright Act (DMCA) and other applicable intellectual property laws.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        We take copyright infringement seriously and will respond to valid DMCA notices in accordance with applicable law.
                    </p>
                </div>
            </section>

            {/* What is Groovia */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    What is Groovia?
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        <span className="font-semibold text-purple-400">Groovia is a music indexing and discovery platform.</span> We do not host, store, or upload any audio files on our own servers. All music content available through Groovia is indexed from publicly available third-party sources on the internet or provided by external platforms.
                    </p>
                    <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-gray-400 font-semibold mb-2">Important Points:</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>We <strong>do NOT host</strong> any audio files on our servers</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>We only <strong>index and link</strong> to publicly available third-party sources</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>We do NOT control or take responsibility for content hosted on external websites</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>We do NOT claim ownership of any audio content displayed or linked on this platform</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-gray-400 text-sm italic">
                        All trademarks, songs, and copyrights belong to their respective owners.
                    </p>
                </div>
            </section>

            {/* DMCA Takedown Process */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    DMCA Takedown Procedure
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        If you believe that your copyrighted work has been linked, indexed, or referenced on Groovia without authorization, you may submit a DMCA takedown request. Upon receiving a valid complaint, we will review and remove the infringing link or reference from our platform where technically possible.
                    </p>

                    <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-purple-400">
                            Required Information for DMCA Notice
                        </h3>
                        <p className="text-sm text-gray-400">
                            To file a valid DMCA takedown request, please include the following information:
                        </p>
                        <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                            <li>Your full legal name and contact information (email address, phone number)</li>
                            <li>Identification of the copyrighted work claimed to have been infringed</li>
                            <li>The specific URL(s) or location on Groovia where the infringing material appears</li>
                            <li>A statement that you have a good faith belief that the disputed use is not authorized</li>
                            <li>A statement, under penalty of perjury, that the information in your notice is accurate and you are authorized to act on behalf of the copyright owner</li>
                            <li>Your physical or electronic signature</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BiEnvelope className="text-purple-500" />
                    Submit DMCA Request
                </h2>
                <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-900/30 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300">
                        Please send your DMCA takedown notice to:
                    </p>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                        <p className="text-purple-400 font-mono text-lg">
                            univora.site
                        </p>
                    </div>
                    <p className="text-sm text-gray-400">
                        Include "DMCA Takedown Request" in the subject line. We will review and respond to valid requests within 48-72 hours.
                    </p>
                </div>
            </section>

            {/* Important Disclaimer */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaExclamationTriangle className="text-amber-500" />
                    Important Disclaimer
                </h2>
                <div className="bg-amber-950/20 border-2 border-amber-600/40 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        <strong className="text-amber-400">Please Note:</strong> Groovia only indexes publicly available information from third-party sources. We do not control external websites or their content.
                    </p>
                    <p className="text-gray-300 leading-relaxed font-semibold">
                        Removal from Groovia does not guarantee removal from the original source.
                    </p>
                    <p className="text-sm text-gray-400">
                        If you want content permanently removed from the internet, you must contact the website that actually hosts the content. We can only remove links and references from our indexing platform.
                    </p>
                </div>
            </section>

            {/* Counter-Notice */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    Counter-Notice Procedure
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        If you believe that your content was removed as a result of mistake or misidentification, you may file a counter-notice with us. A counter-notice must include:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>Your name, address, phone number, and email address</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>Description of the material that was removed and its location before removal</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>Your physical or electronic signature</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Repeat Infringer Policy */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                    Repeat Infringer Policy
                </h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">
                        Groovia has a policy of terminating, in appropriate circumstances, the accounts or access of users who are repeat infringers of intellectual property rights.
                    </p>
                </div>
            </section>

            {/* Footer Links */}
            <div className="pt-8 border-t border-zinc-800">
                <div className="flex flex-wrap gap-4 justify-center">
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
                    For general inquiries, please visit{' '}
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
