
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { useAuth } from "../context/auth-context"
import { Link } from "react-router-dom"

export default function HomePage() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-20 sm:py-32">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Manage Your Events
                            <span className="block text-blue-200">Like Never Before</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-blue-100">
                            Create, discover, and join amazing events in your community. EventHub makes event management simple and
                            engaging.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {user ? (
                                <Link to="/events">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                        Explore Events
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            )}
                            {user && (
                                <Link to="/add-event">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                                    >
                                        Create Event
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage events
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Powerful features to help you create, manage, and attend events seamlessly.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-5xl">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-8 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                        <Calendar className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900">Easy Event Creation</h3>
                                    <p className="mt-4 text-gray-600">
                                        Create and customize events with our intuitive form. Add all the details your attendees need.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-8 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Users className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900">Join & Connect</h3>
                                    <p className="mt-4 text-gray-600">
                                        Discover events in your area and connect with like-minded people in your community.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-8 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                        <MapPin className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Filtering</h3>
                                    <p className="mt-4 text-gray-600">
                                        Find exactly what you're looking for with powerful search and filtering options.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to get started?</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Join thousands of event organizers and attendees who trust EventHub.
                        </p>
                        <div className="mt-8">
                            {user ? (
                                <Link to="/add-event">
                                    <Button size="lg">
                                        Create Your First Event
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/register">
                                    <Button size="lg">
                                        Sign Up Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
