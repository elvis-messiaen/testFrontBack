package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;


public class UserDetailsImplTest {

    @Test
    public void testGetId() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().id(1L).build();
        assertThat(userDetails.getId()).isEqualTo(1L);
    }

    @Test
    public void testGetUsername() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().username("testuser").build();
        assertThat(userDetails.getUsername()).isEqualTo("testuser");
    }

    @Test
    public void testGetFirstName() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().firstName("John").build();
        assertThat(userDetails.getFirstName()).isEqualTo("John");
    }

    @Test
    public void testGetLastName() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().lastName("Doe").build();
        assertThat(userDetails.getLastName()).isEqualTo("Doe");
    }

    @Test
    public void testGetPassword() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().password("password").build();
        assertThat(userDetails.getPassword()).isEqualTo("password");
    }

    @Test
    public void testIsAdmin() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().admin(true).build();
        assertThat(userDetails.getAdmin()).isTrue();
    }

    @Test
    public void testGetAuthorities() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertThat(authorities).isEmpty();
    }

    @Test
    public void testIsAccountNonExpired() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    @Test
    public void testIsAccountNonLocked() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    @Test
    public void testIsCredentialsNonExpired() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    @Test
    public void testIsEnabled() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    public void testEquals() {
        UserDetailsImpl userDetails1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl userDetails2 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl userDetails3 = UserDetailsImpl.builder().id(2L).build();

        assertThat(userDetails1).isEqualTo(userDetails2);
        assertThat(userDetails1).isNotEqualTo(userDetails3);
    }

}
