"use client"

import type React from "react"
import { useRef } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Target,
  BarChart2,
  CheckCircle,
  Clock,
  PlayCircle,
  User,
  Zap,
  TrendingUp,
  Award,
  Rocket,
  Star,
} from "lucide-react"

// StatCard Component
interface StatCardProps {
  value: string
  description: string
  icon: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ value, description, icon }) => {
  return (
    <div className="bg-gray-100 rounded-xl border border-gray-100 relative overflow-hidden group">
      <div className="p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-algotrek-aqua/10 text-algotrek-aqua mb-6 relative z-10">
          {icon}
        </div>
        <div className="flex items-baseline gap-1">
          <div className="text-5xl font-bold text-algotrek-aqua font-inter relative z-10">{value}</div>
        </div>
        <div className="text-algotrek-dark-blue/80 mt-2 font-inter text-xl font-semibold relative z-10">
          {description}
        </div>
        <div className="text-algotrek-dark-blue/60 text-sm mt-2 relative z-10 leading-relaxed">
          AI-powered interview preparation that adapts to your learning style
        </div>
      </div>
    </div>
  )
}

// StatsSection Component
interface StatsSectionProps {
  statsRef: React.RefObject<HTMLDivElement>
}

const StatsSection: React.FC<StatsSectionProps> = ({ statsRef }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      ref={statsRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      <motion.div variants={itemVariants}>
        <StatCard value="95%" description="Interview Success Rate" icon={<TrendingUp className="w-8 h-8" />} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard value="2000+" description="Problems Solved Daily" icon={<BarChart2 className="w-8 h-8" />} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard value="85%" description="Land Dream Jobs" icon={<Award className="w-8 h-8" />} />
      </motion.div>
    </motion.div>
  )
}

// PlatformDemo Component
const PlatformDemo = () => {
  return (
    <div className="relative max-w-5xl mx-auto mb-20">
      {/* Gradient background */}
      <div className="absolute inset-0 -m-10 bg-gradient-to-br from-algotrek-aqua/20 via-algotrek-pink/20 to-algotrek-aqua/20 rounded-3xl blur-3xl opacity-40"></div>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
        {/* Platform UI Header - AlgoTrek Dashboard */}
        <div className="bg-white border-b border-gray-200 flex items-center px-6 py-3">
          <div className="flex space-x-1 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            <div className="px-4 py-2 text-algotrek-aqua bg-algotrek-aqua/10 rounded-t-lg font-medium text-sm border-b-2 border-algotrek-aqua">
              AI Scheduler
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-t-lg font-medium text-sm">
              Company Sheets
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-t-lg font-medium text-sm">
              Progress (85%)
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-t-lg font-medium text-sm">Analytics</div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs font-medium text-green-700">15-day streak</span>
            </div>
            <div className="flex items-center bg-algotrek-aqua/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-algotrek-aqua rounded-full mr-2"></div>
              <span className="text-xs font-medium text-algotrek-aqua">245 solved</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Main Content Area - AI Schedule Generator */}
        <div className="bg-gray-50 p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Schedule Generator */}
            <div className="col-span-8 space-y-6">
              {/* AI Schedule Generator */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-algotrek-dark-blue flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-algotrek-aqua" />
                    AI Schedule Generator
                  </h3>
                  <div className="bg-algotrek-aqua/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-algotrek-aqua">Powered by AI</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Target Companies</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-algotrek-aqua/10 text-algotrek-aqua text-xs px-2 py-1 rounded-md">
                        Google
                      </span>
                      <span className="bg-algotrek-pink/10 text-algotrek-pink text-xs px-2 py-1 rounded-md">
                        Amazon
                      </span>
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">Microsoft</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                    <div className="text-sm text-gray-600">Nov 25 - Dec 25, 2024 (30 days)</div>
                  </div>
                </div>

                {/* Generated Schedule */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                    <Zap className="w-4 h-4 text-algotrek-aqua mr-1" />
                    Your Personalized Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium">Day 1-5: Arrays & Strings</div>
                          <div className="text-xs text-gray-500">Google, Amazon focus • 15 problems</div>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 font-medium">Completed</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-algotrek-aqua/5 rounded-lg border border-algotrek-aqua/20">
                      <div className="flex items-center">
                        <PlayCircle className="w-4 h-4 text-algotrek-aqua mr-3" />
                        <div>
                          <div className="text-sm font-medium">Day 6-10: Dynamic Programming</div>
                          <div className="text-xs text-gray-500">Microsoft focus • 12 problems</div>
                        </div>
                      </div>
                      <div className="text-xs text-algotrek-aqua font-medium">In Progress (3/12)</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium">Day 11-15: Trees & Graphs</div>
                          <div className="text-xs text-gray-500">Google, Amazon focus • 18 problems</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Upcoming</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Progress Analytics */}
            <div className="col-span-4 space-y-4">
              {/* Progress Overview */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <BarChart2 className="w-4 h-4 text-algotrek-aqua mr-1" />
                  Progress Overview
                </h3>
                <div className="text-2xl font-bold text-algotrek-dark-blue mb-2">245/400</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-algotrek-aqua h-2 rounded-full" style={{ width: "61%" }}></div>
                </div>
                <div className="text-xs text-gray-500">61% Complete</div>
              </div>

              {/* Company Focus */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Company Readiness</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Google</span>
                    <span className="text-sm font-medium text-algotrek-aqua">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Amazon</span>
                    <span className="text-sm font-medium text-algotrek-pink">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Microsoft</span>
                    <span className="text-sm font-medium text-blue-600">68%</span>
                  </div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty Mastery</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Easy</span>
                    <span className="text-sm font-medium">92% (115/125)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600">Medium</span>
                    <span className="text-sm font-medium">58% (105/180)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Hard</span>
                    <span className="text-sm font-medium">26% (25/95)</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Target className="w-4 h-4 text-algotrek-pink mr-1" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full bg-algotrek-aqua text-algotrek-dark-blue py-2 rounded-lg text-sm font-medium">
                    {"Today's Problems"}
                  </button>
                  <button className="w-full border border-algotrek-pink text-algotrek-pink py-2 rounded-lg text-sm font-medium">
                    Mock Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating UI Element */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-8 top-1/3 z-10"
      >
        <div className="animate-float bg-white/70 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/20 flex items-center">
          <div className="bg-algotrek-aqua/20 rounded-lg p-2 mr-3">
            <CheckCircle className="w-4 h-4 text-algotrek-aqua" />
          </div>
          <div>
            <div className="text-gray-800 text-xs font-medium">Problem solved!</div>
            <div className="text-gray-600 text-xs">Two Sum - Easy</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Testimonials Component
const testimonials = [
  {
    id: 1,
    quote:
      "AlgoTrek&apos;s AI scheduler helped me land my dream job at Google. The company-specific questions were spot on!",
    name: "Sarah Chen",
    title: "Software Engineer at Google",
    company: "Google",
    logo: "google",
    bgColor: "bg-[#efeaf5]",
  },
  {
    id: 2,
    quote:
      "The personalized schedule kept me on track and motivated. I solved 300+ problems in just 6 weeks and aced my Amazon interview.",
    name: "Mike Rodriguez",
    title: "SDE at Amazon",
    company: "Amazon",
    logo: "amazon",
    bgColor: "bg-[#fde7dc]",
  },
  {
    id: 3,
    quote:
      "Best investment I made for my career. The visual progress tracking kept me motivated throughout my Microsoft prep.",
    name: "Alex Kim",
    title: "Software Developer at Microsoft",
    company: "Microsoft",
    logo: "microsoft",
    bgColor: "bg-[#e9e9e9]",
  },
]

const stats = [
  {
    id: 1,
    value: "2,500+",
    description: "problems solved daily",
    company: "AlgoTrek",
    bgColor: "bg-[#efeaf5]",
  },
  {
    id: 2,
    value: "Meta",
    description: "",
    company: "Meta",
    bgColor: "bg-white",
  },
  {
    id: 3,
    value: "Apple",
    description: "",
    company: "Apple",
    bgColor: "bg-white",
  },
]

const Testimonials = () => {
  return (
    <section className="py-8 bg-white" id="testimonials">
      <div className="container-section max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Trusted by developers at top companies</h2>
        </motion.div>
        <div className="grid grid-cols-12 gap-4">
          {/* Stats box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${stats[0].bgColor} p-8 flex flex-col`}>
              <div className="mt-auto">
                <div className="text-5xl font-bold mb-2">{stats[0].value}</div>
                <div className="text-gray-600">{stats[0].description}</div>
              </div>
              <div className="mt-auto pt-6">
                <div className="font-bold text-lg">
                  <span className="text-algotrek-aqua">Algo</span>
                  <span className="text-algotrek-pink">Trek</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Meta box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden border border-gray-100"
          >
            <div className="h-full flex items-center justify-center p-6">
              <div className="font-bold text-2xl text-blue-600">Meta</div>
            </div>
          </motion.div>

          {/* First testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-8 lg:col-span-6 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${testimonials[0].bgColor} p-8 flex flex-col`}>
              <div className="text-2xl font-medium mb-8">&ldquo;{testimonials[0].quote}&rdquo;</div>
              <div className="mt-auto">
                <div className="font-medium">{testimonials[0].name}</div>
                <div className="text-gray-600 text-sm">{testimonials[0].title}</div>
              </div>
            </div>
          </motion.div>

          {/* Second testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-7 lg:col-span-6 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${testimonials[1].bgColor} p-8 flex flex-col`}>
              <div className="text-2xl font-medium mb-8">&ldquo;{testimonials[1].quote}&rdquo;</div>
              <div className="mt-auto">
                <div className="font-medium">{testimonials[1].name}</div>
                <div className="text-gray-600 text-sm">{testimonials[1].title}</div>
              </div>
            </div>
          </motion.div>

          {/* Apple box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-5 lg:col-span-3 rounded-xl overflow-hidden border border-gray-100"
          >
            <div className="h-full flex items-center justify-center p-6">
              <div className="font-bold text-xl text-gray-800">Apple</div>
            </div>
          </motion.div>

          {/* Third testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-12 lg:col-span-3 rounded-xl overflow-hidden"
          >
            <div className={`h-full ${testimonials[2].bgColor} p-8 flex flex-col`}>
              <div className="text-2xl font-medium mb-8">&ldquo;{testimonials[2].quote}&rdquo;</div>
              <div className="mt-auto">
                <div className="font-medium">{testimonials[2].name}</div>
                <div className="text-gray-600 text-sm">{testimonials[2].title}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Main Landing Page Component
export default function AlgoTrekLanding() {
  const statsRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="font-bold text-xl">
                <span className="text-algotrek-aqua">Algo</span>
                <span className="text-algotrek-pink">Trek</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-algotrek-aqua transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-algotrek-aqua transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-algotrek-aqua transition-colors">
                Pricing
              </a>
              <button className="bg-algotrek-aqua text-algotrek-dark-blue px-6 py-2 rounded-lg font-medium hover:bg-algotrek-aqua/90 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-algotrek-dark-blue mb-6"
            >
              Master Coding Interviews with <span className="text-algotrek-aqua">AI-Powered</span>{" "}
              <span className="text-algotrek-pink">Scheduling</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Get personalized study schedules, company-specific problem sets, and AI-driven insights to land your dream
              job at top tech companies.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button className="bg-algotrek-aqua text-algotrek-dark-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-algotrek-aqua/90 transition-colors flex items-center">
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Journey
              </button>
              <button className="border-2 border-algotrek-pink text-algotrek-pink px-8 py-4 rounded-lg font-semibold text-lg hover:bg-algotrek-pink hover:text-white transition-colors flex items-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-algotrek-dark-blue mb-4"
            >
              Experience the Power of AI-Driven Learning
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              See how our intelligent platform creates personalized study paths tailored to your target companies and
              skill level.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PlatformDemo />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-algotrek-dark-blue mb-4"
            >
              Proven Results That Speak for Themselves
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Join thousands of developers who have successfully landed their dream jobs using AlgoTrek.
            </motion.p>
          </div>
          <StatsSection statsRef={statsRef} />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-algotrek-aqua/10 via-algotrek-pink/10 to-algotrek-aqua/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-algotrek-dark-blue mb-6"
          >
            Ready to Land Your Dream Job?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-8"
          >
            Join thousands of developers who have successfully prepared for their coding interviews with AlgoTrek.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-algotrek-aqua text-algotrek-dark-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-algotrek-aqua/90 transition-colors flex items-center mx-auto"
          >
            <Star className="w-5 h-5 mr-2" />
            Start Free Trial
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-algotrek-dark-blue text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl mb-4">
                <span className="text-algotrek-aqua">Algo</span>
                <span className="text-algotrek-pink">Trek</span>
              </div>
              <p className="text-gray-300">
                AI-powered coding interview preparation platform for aspiring software engineers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-algotrek-aqua transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 AlgoTrek. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
