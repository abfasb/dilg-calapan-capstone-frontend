import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 animate-gradient-x">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <Card className="relative bg-white/5 dark:bg-gray-900/50 p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="text-red-400/90 mb-4"
            >
              <div className="relative">
                <AlertCircle className="w-20 h-20" />
                <div className="absolute inset-0 bg-red-500/10 rounded-full blur-lg" />
              </div>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Access Restricted
              </h1>
              <p className="text-gray-300 text-lg">
                You don't have permission to view this realm
              </p>
            </div>

            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-8 py-6 transition-all"
            >
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-semibold">
                Return to Safety
              </span>
            </Button>
          </div>

          <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
        </Card>

        <div className="absolute inset-0 -z-10 flex justify-center items-center overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-2 h-2 bg-red-400/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

