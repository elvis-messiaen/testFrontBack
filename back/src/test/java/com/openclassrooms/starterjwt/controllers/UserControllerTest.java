package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void testFindById_UserExists() throws Exception {
        User user = mock(User.class);
        UserDto userDto = new UserDto(1L, "email@example.com", "Nom", "Prenom", true, "motdepasse", null, null);

        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        mockMvc.perform(get("/api/user/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.email").value("email@example.com"));
    }

    @Test
    public void testFindById_UserNotFound() throws Exception {
        when(userService.findById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/user/1"))
               .andExpect(status().isNotFound());
    }

    @Test
    public void testFindById_InvalidId() throws Exception {
        mockMvc.perform(get("/api/user/invalidId"))
               .andExpect(status().isBadRequest());
    }


    @Test
    @WithMockUser(username = "yoga@studio.com", roles = {"ADMIN"})
    public void testDelete_UserExists() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("yoga@studio.com");
        user.setAdmin(true);
    
        when(userService.findById(1L)).thenReturn(user);
    
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("yoga@studio.com")
                .password("motdepasse")
                .authorities(Collections.emptyList())
                .build();
    
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, "motdepasse", userDetails.getAuthorities()));
    
        mockMvc.perform(delete("/api/user/1"))
               .andExpect(status().isOk());
    
        verify(userService).delete(1L);
    }
    
 
    @Test
    @WithMockUser(username = "wrong@example.com")
    public void testDelete_UserUnauthorized() throws Exception {
        User user = mock(User.class);

        when(userService.findById(1L)).thenReturn(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("wrong@example.com")
                .password("motdepasse")
                .authorities(Collections.emptyList())
                .build();

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, "motdepasse", userDetails.getAuthorities()));

        mockMvc.perform(delete("/api/user/1"))
               .andExpect(status().isUnauthorized());
    }

    @Test
    public void testDelete_UserNotFound() throws Exception {
        when(userService.findById(1L)).thenReturn(null);

        mockMvc.perform(delete("/api/user/1"))
               .andExpect(status().isNotFound());
    }

    @Test
    public void testDelete_InvalidId() throws Exception {
        mockMvc.perform(delete("/api/user/invalidId"))
               .andExpect(status().isBadRequest());
    }
}
