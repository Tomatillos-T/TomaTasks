FROM eclipse-temurin:22-jdk-jammy
#COPY pom.xml /tmp/
#COPY src /tmp/src/
WORKDIR /tmp/
EXPOSE 8080
COPY target/tomatask-0.0.1-SNAPSHOT.jar tomatask.jar
ENTRYPOINT ["java","-jar","tomatask.jar"]