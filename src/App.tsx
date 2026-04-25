import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SmartphoneSimulator from './components/SmartphoneSimulator';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="app-container">
      <SmartphoneSimulator />
    </div>
  );
}

export default App;