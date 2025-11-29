import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-x-hidden pt-24 lg:pt-0">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

        {/* Animated shapes */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-40 h-40 lg:w-72 lg:h-72 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-60 h-60 lg:w-96 lg:h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-full">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right order-1 lg:order-1 w-full"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-secondary-500/20 text-secondary-300 px-4 py-4 rounded-full text-sm font-medium mb-4 lg:mb-6"
            >
              عضو مجلس الشيوخ المصري
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 lg:mb-6 leading-tight"
            >
              د. حسين خضير
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-4"
            >
              رئيس مجلس إدارة شركة نابكو للأدوية
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0"
            >
              وكيل لجنة الصحة بمجلس الشيوخ • الرئيس السابق للجنة الصحة
              <br />
              نعمل معاً من أجل صحة أفضل لكل مصري
            </motion.p>

            {/* Buttons - Desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  💡 قدّم مقترحك
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  تعرف عليّ أكثر
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-2 w-full max-w-md mx-auto"
          >
            <div className="relative">
              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-32 h-32 lg:w-40 lg:h-40 border-2 border-secondary-500/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 lg:w-60 lg:h-60 border-2 border-primary-400/30 rounded-full"
              />

              {/* Image placeholder */}
              <div className="relative z-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl aspect-[3/4] max-w-md mx-auto overflow-hidden shadow-2xl border-4 border-amber-500/20">
                <img
                  src="/images/dr-hussein-khodair.jpg"
                  alt="الدكتور حسين خضير"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Buttons - Mobile only, below image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex lg:hidden flex-wrap gap-4 justify-center mt-6"
            >
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  💡 قدّم مقترحك
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  تعرف عليّ أكثر
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
