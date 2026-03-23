module.exports = {
  theme: {
    extend: {
      keyframes: {
        "rocket-float": {
          "0%, 100%": { transform: "translateY(0) rotate(3deg)" },
          "50%": { transform: "translateY(-10px) rotate(6deg)" },
        },
      },
      animation: {
        "rocket-slow": "rocket-float 3s ease-in-out infinite",
      },
    },
  },
};
