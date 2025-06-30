import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { RocketIcon, CalendarIcon, HomeIcon } from "lucide-react";

export default function NotFoundPage() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
            <CalendarIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <p className="text-indigo-100">Event not found</p>
        </div>

        <div className="p-8 text-center">
          <div className="mx-auto max-w-xs">
            <RocketIcon className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Lost in the schedule
            </h2>
            <p className="text-gray-500 mb-6">
              The event you're looking for doesn't exist or may have been moved.
              Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')} variant="default" className="gap-2">
                  <HomeIcon className="h-4 w-4" />
                  Go Home
              </Button>
              <Button onClick={() => navigate('/events')} variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Browse Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help?{" "}
          <Link
            to="/contact"
            className="text-indigo-600 hover:underline font-medium"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}