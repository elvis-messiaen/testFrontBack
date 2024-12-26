package com.openclassrooms.starterjwt.security.jwt;


import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.ArrayList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        SecurityContextHolder.clearContext();

        when(request.getHeader("Authorization")).thenReturn("Bearer valid-jwt-token");
        when(jwtUtils.validateJwtToken("valid-jwt-token")).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken("valid-jwt-token")).thenReturn("testuser");
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(userDetails.getAuthorities()).thenReturn(new ArrayList<>());
    }

    private void invokeDoFilterInternal(AuthTokenFilter filter, HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws Exception {
        Method method = AuthTokenFilter.class.getDeclaredMethod("doFilterInternal", HttpServletRequest.class, HttpServletResponse.class, FilterChain.class);
        method.setAccessible(true);
        method.invoke(filter, request, response, filterChain);
    }

    @Test
    public void testDoFilterInternal() throws Exception {
        invokeDoFilterInternal(authTokenFilter, request, response, filterChain);

        verify(jwtUtils, times(1)).validateJwtToken("valid-jwt-token");
        verify(jwtUtils, times(1)).getUserNameFromJwtToken("valid-jwt-token");
        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
        verify(filterChain, times(1)).doFilter(request, response);

        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken)
                SecurityContextHolder.getContext().getAuthentication();

        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isEqualTo(userDetails);
    }

    @Test
    public void testDoFilterInternalInvalidToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid-jwt-token");
        when(jwtUtils.validateJwtToken("invalid-jwt-token")).thenReturn(false);

        invokeDoFilterInternal(authTokenFilter, request, response, filterChain);

        verify(jwtUtils, times(1)).validateJwtToken("invalid-jwt-token");
        verify(jwtUtils, never()).getUserNameFromJwtToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(filterChain, times(1)).doFilter(request, response);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    public void testDoFilterInternalNoToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        invokeDoFilterInternal(authTokenFilter, request, response, filterChain);

        verify(jwtUtils, never()).validateJwtToken(anyString());
        verify(jwtUtils, never()).getUserNameFromJwtToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(filterChain, times(1)).doFilter(request, response);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    public void testDoFilterInternalException() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer valid-jwt-token");
        doThrow(new RuntimeException("JWT validation error")).when(jwtUtils).validateJwtToken("valid-jwt-token");

        invokeDoFilterInternal(authTokenFilter, request, response, filterChain);

        verify(jwtUtils, times(1)).validateJwtToken("valid-jwt-token");
        verify(jwtUtils, never()).getUserNameFromJwtToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(filterChain, times(1)).doFilter(request, response);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}
