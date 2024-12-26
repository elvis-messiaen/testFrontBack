package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthEntryPointJwtTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        when(authException.getMessage()).thenReturn("Unauthorized");
        when(request.getServletPath()).thenReturn("/test-path");
    }

    @Test
    public void testCommence() throws IOException, ServletException {
        ServletOutputStream outputStream = mock(ServletOutputStream.class);
        when(response.getOutputStream()).thenReturn(outputStream);

        authEntryPointJwt.commence(request, response, authException);

        verify(response).setContentType("application/json");
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", "Unauthorized");
        body.put("path", "/test-path");

        objectMapper.writeValue(outputStream, body);
    }
}


