import { useRouter as useNextRouter } from "next/navigation";
import { getFullPath, APP_CONFIG } from "@/lib/config";

// 自定义路由钩子
export const useAppRouter = () => {
  const router = useNextRouter();

  const push = (path: string) => {
    const fullPath = getFullPath(path);
    router.push(fullPath);
  };

  const replace = (path: string) => {
    const fullPath = getFullPath(path);
    router.replace(fullPath);
  };

  const back = () => {
    router.back();
  };

  const forward = () => {
    router.forward();
  };

  const refresh = () => {
    router.refresh();
  };

  // 预定义的常用路由方法
  const goToHome = () => push(APP_CONFIG.routes.home);
  const goToLogin = () => push(APP_CONFIG.routes.login);
  const goToAdmin = () => push(APP_CONFIG.routes.admin);

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    goToHome,
    goToLogin,
    goToAdmin,
  };
};
