package com.springboot.TomaTask.config;

import oracle.jdbc.pool.OracleDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
public class OracleConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(OracleConfiguration.class);

    private final Environment env;

    public OracleConfiguration(Environment env) {
        this.env = env;
    }

    @Bean
    public DataSource dataSource() throws SQLException {
        OracleDataSource ds = new OracleDataSource();

        String driver = env.getProperty("spring.datasource.driver-class-name");
        String url = env.getProperty("db_url");
        String user = env.getProperty("db_user");
        String password = env.getProperty("db_password");

        ds.setDriverType(driver);
        logger.info("Using Driver: {}", driver);

        ds.setURL(url);
        logger.info("Using URL: {}", url);

        ds.setUser(user);
        logger.info("Using Username: {}", user);

        ds.setPassword(password);

        return ds;
    }
}

