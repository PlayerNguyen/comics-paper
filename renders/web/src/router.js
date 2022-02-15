import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
// -- user
import Home from "./pages/home";
import Series from "./pages/series";
import SerieDetail from "./pages/series/detail";
// -- admin
import AdminDashboard from "./pages/admin/dashboard";
import AdminUsers from "./pages/admin/users";
// components
import { AdminLayout, UserLayout } from "./components";

function AppRouter() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<Home />} />
                        <Route path="series" element={<Series />} />
                        <Route path="series/:url" element={<SerieDetail />} />
                        <Route path="*" element={<Home />} />
                    </Route>
                    <Route path="/dashboard" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default AppRouter;
