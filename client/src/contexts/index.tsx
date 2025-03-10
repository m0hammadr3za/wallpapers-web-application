import LoadingProvider from "./LoadingContext";
import UserProvider from "./UserContext";
import WallpaperProvider from "./WallpaperContext";

export default function AppProvider({ children }: any) {
  return (
    <LoadingProvider>
      <UserProvider>
        <WallpaperProvider>{children}</WallpaperProvider>
      </UserProvider>
    </LoadingProvider>
  );
}
