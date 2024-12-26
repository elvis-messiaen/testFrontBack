package com.openclassrooms.starterjwt;

import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
@ExtendWith(LoggingExtension.class)
@SpringBootTest
public class SpringBootSecurityJwtApplicationTests {
	private Logger logger;

	public void setLogger(Logger logger) {
		this.logger = logger;
	}

	@Test
	public void contextLoads() {
		logger.info(("Je suis un test de message"));
	}

}
