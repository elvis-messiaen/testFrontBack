package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MessageResponseTest {

    @Test
    public void testConstructorAndGetMessage() {
        String message = "Test message";
        MessageResponse messageResponse = new MessageResponse(message);
        assertEquals(message, messageResponse.getMessage());
    }

    @Test
    public void testSetMessage() {
        String initialMessage = "Initial message";
        MessageResponse messageResponse = new MessageResponse(initialMessage);

        String newMessage = "New message";
        messageResponse.setMessage(newMessage);
        assertEquals(newMessage, messageResponse.getMessage());
    }
}
