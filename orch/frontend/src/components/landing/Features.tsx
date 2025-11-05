"use client";
import { ShieldCheck, Smile, Zap, Globe, Cpu, Scaling } from "lucide-react";
import React from "react";
import { PointerHighlight } from "../ui/pointer-highlight";
import { motion } from "framer-motion";

const features = [
  {
    name: "Effortless Dataset Upload",
    description:
      "Easily upload and manage your datasets for fine-tuning, supporting various formats for seamless integration.",
    highlight: "various formats",
    icon: <ShieldCheck className="w-12 h-12" />,
    gradient: "linear-gradient(to right, #22D3EE, #D946EF)",
  },
  {
    name: "Diverse Model Selection",
    description:
      "Choose from a wide range of pre-trained QLoRA compatible models to kickstart your fine-tuning process.",
    highlight: "pre-trained QLoRA compatible models",
    icon: <Smile className="w-12 h-12" />,
    gradient: "linear-gradient(to right, #D946EF, #F97316)",
  },
  {
    name: "Streamlined Fine-tuning Jobs",
    description:
      "Launch and monitor your QLoRA fine-tuning jobs with an intuitive interface and real-time progress updates.",
    highlight: "intuitive interface",
    icon: <Zap className="w-12 h-12" />,
    gradient: "linear-gradient(to right, #F97316, #BEF264)",
  },
  {
    name: "Dedicated Model APIs",
    description:
      "Upon successful fine-tuning, receive a dedicated API endpoint for seamless integration of your custom model into your applications.",
    highlight: "dedicated API endpoint",
    icon: <Globe className="w-12 h-12" />,
    gradient: "linear-gradient(to right, #BEF264, #22D3EE)",
  },
  {
    name: "Scalable Infrastructure",
    description:
      "Our robust infrastructure ensures your fine-tuning jobs run efficiently and can handle large datasets and complex models.",
    highlight: "robust infrastructure",
    icon: <Cpu className="w-12 h-12" />,
    gradient: "linear-gradient(to right, #22D3EE, #F97316)",
  },
  {
    name: "Comprehensive Monitoring",
    description:
      "Monitor the performance and resource utilization of your fine-tuning jobs with detailed logs and metrics.",
    highlight: "detailed logs and metrics",
    icon: <Scaling className="w-12 h-12" />,
    gradient: "linear-gradient(to right, #D946EF, #BEF264)",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Key Features of Our Fine-tuning Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-neutral-400 mt-4 max-w-3xl mx-auto"
          >
            Our platform offers a comprehensive set of features to streamline your QLoRA model fine-tuning workflow.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-px rounded-lg overflow-hidden"
              style={{ background: feature.gradient }}
            >
              <div className="bg-card p-6 rounded-lg h-full w-full">
                <div
                  className="flex items-center justify-center h-16 w-16 rounded-full mb-4"
                  style={{ background: feature.gradient }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.name}
                </h3>
                <div className="text-neutral-400">
                  {feature.description
                    .split(feature.highlight)
                    .map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i <
                          feature.description.split(feature.highlight).length -
                            1 && (
                          <PointerHighlight
                            rectangleClassName={`leading-loose`}
                            pointerClassName={`h-3 w-3`}
                            containerClassName="inline-block mx-1"
                          >
                            <span
                              className="relative z-10"
                              style={{
                                background: feature.gradient,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {feature.highlight}
                            </span>
                          </PointerHighlight>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}