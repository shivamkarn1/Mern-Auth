import { Avatar } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@chakra-ui/react";

const UserMenu = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  return (
    <MenuRoot lazyMount positioning={{ placement: "right-start" }}>
      <MenuTrigger position="absolute" left="1.5rem" bottom="1.5rem" asChild>
        <Avatar.Root>
          <Avatar.Image src="#" />
        </Avatar.Root>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="profile" onClick={() => navigate("/")}>
          Profile
        </MenuItem>
        <MenuItem value="settings" onClick={() => navigate("/settings")}>
          Settings
        </MenuItem>
        <MenuItem value="logout" onClick={() => signOut()}>
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
export default UserMenu;
