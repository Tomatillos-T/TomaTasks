FROM openjdk:22
#COPY pom.xml /tmp/
#COPY src /tmp/src/
WORKDIR /tmp/
EXPOSE 8080
COPY target/TomaTask-0.0.1-SNAPSHOT.jar TomaTask.jar
ENTRYPOINT ["java","-jar","TomaTask.jar"]