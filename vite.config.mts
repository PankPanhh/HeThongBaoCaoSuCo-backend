import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// Plugin để copy static files sau khi build
const copyStaticFiles = () => {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const sourceDir = join(__dirname, 'public', 'static');
      const targetDir = join(__dirname, 'www', 'static');
      
      const copyRecursive = (src: string, dest: string) => {
        if (!existsSync(src)) return;
        
        if (!existsSync(dest)) {
          mkdirSync(dest, { recursive: true });
        }
        
        const entries = readdirSync(src);
        for (const entry of entries) {
          const srcPath = join(src, entry);
          const destPath = join(dest, entry);
          
          if (statSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      };
      
      copyRecursive(sourceDir, targetDir);
      console.log('✅ Static files copied to www/static/');
    }
  };
};

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    publicDir: "../public",
    envDir: "../",
    plugins: [zaloMiniApp(), react(), copyStaticFiles()],
    define: {
      "import.meta.env.VITE_API_BASE": JSON.stringify(process.env.VITE_API_BASE || "http://localhost:3001"),
    },
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/static": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
  });
};
