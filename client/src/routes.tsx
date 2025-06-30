import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "../src/components/private";
import PublicRoute from "../src/components/public";
import NotFound404Page from "./views/404";
import HomePage from "./views/home-view";
import Layout from "./components/layout";
import LoginPage from "./views/login";
import RegisterPage from "./views/register";
import EventsPage from "./views/events";
import AddEventPage from "./views/add-event";
import MyEventsPage from "./views/my-events";


const AppRouter = () => {



    return (
        <Router>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<Layout><HomePage /></Layout>} />
                </Route>
                <Route element={<PublicRoute restricted />}>
                    <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                    <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route
                        path="/events"
                        element={
                            <Layout>
                                <EventsPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/add-event"
                        element={
                            <Layout>
                                <AddEventPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/my-events"
                        element={
                            <Layout>
                                <MyEventsPage />
                            </Layout>
                        }
                    />
                </Route>
                <Route path="*" element={<NotFound404Page />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;