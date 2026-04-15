package com.vtm.character_sheet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CharacterSheetApplication {

	public static void main(String[] args) {
		SpringApplication.run(CharacterSheetApplication.class, args);
	}

}
