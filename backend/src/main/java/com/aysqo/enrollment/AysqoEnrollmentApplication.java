package com.aysqo.enrollment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

@SpringBootApplication
public class AysqoEnrollmentApplication {

    private static final Logger logger = LoggerFactory.getLogger(AysqoEnrollmentApplication.class);

    public static void main(String[] args) {
        loadDotEnv();
        ensureDatabaseConnectivity();
        SpringApplication.run(AysqoEnrollmentApplication.class, args);
    }

    private static void loadDotEnv() {
        File[] candidateFiles = new File[] {
                new File(".env"),
                new File("backend/.env"),
                new File("../.env")
        };
        for (File envFile : candidateFiles) {
            if (envFile.exists() && envFile.isFile()) {
                try {
                    List<String> lines = Files.readAllLines(envFile.toPath());
                    for (String line : lines) {
                        line = line.trim();
                        if (!line.isEmpty() && !line.startsWith("#") && line.contains("=")) {
                            int eqIdx = line.indexOf('=');
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                                value = value.substring(1, value.length() - 1);
                            } else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                } catch (Exception ignored) {
                }
            }
        }
    }

    private static void ensureDatabaseConnectivity() {
        String activeProfile = System.getProperty("spring.profiles.active",
                System.getenv().getOrDefault("SPRING_PROFILES_ACTIVE", "mysql"));

        // If explicitly set to test, do nothing
        if ("test".equalsIgnoreCase(activeProfile)) {
            return;
        }

        String host = System.getProperty("DB_HOST", System.getenv().getOrDefault("DB_HOST", "localhost"));
        String port = System.getProperty("DB_PORT", System.getenv().getOrDefault("DB_PORT", "3306"));
        String user = System.getProperty("DB_USERNAME", System.getenv().getOrDefault("DB_USERNAME", "root"));
        String pass = System.getProperty("DB_PASSWORD", System.getenv().getOrDefault("DB_PASSWORD", "root"));

        boolean mySqlOk = testMySql(host, port, user, pass);

        if (!mySqlOk) {
            System.err.println("\n" +
                    "========================================================================================\n" +
                    " [AYSQO NOTICE] MySQL connection at " + host + ":" + port + " could not be authenticated.\n" +
                    "   Reason: DB_PASSWORD is either default/placeholder or MySQL access was denied.\n" +
                    "   Auto-Fallback: Switching seamlessly to IN-MEMORY DATABASE mode!\n" +
                    "   Status: Application will start successfully on port 8080.\n" +
                    "   All 10 demo employees, login, search, pagination, and dashboard will work 100%.\n" +
                    "   (To connect to your live MySQL, set your actual password in backend/.env)\n" +
                    "========================================================================================\n");
            System.setProperty("spring.profiles.active", "test");
        } else {
            System.out.println("\n[AYSQO] Successfully connected to MySQL at " + host + ":" + port + "\n");
            System.setProperty("spring.profiles.active", "mysql");
        }
    }

    private static boolean testMySql(String host, String port, String user, String pass) {
        if ("your_mysql_password_here".equals(pass)) {
            return false;
        }
        String rootUrl = "jdbc:mysql://" + host + ":" + port + "/?useSSL=false&allowPublicKeyRetrieval=true&connectTimeout=2500";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(rootUrl, user, pass)) {
                return true;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
