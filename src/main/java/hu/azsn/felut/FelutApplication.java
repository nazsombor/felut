package hu.azsn.felut;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FelutApplication {

    public static void main(String[] args) {
        System.out.println("test");
        SpringApplication.run(FelutApplication.class, args);
    }

}
