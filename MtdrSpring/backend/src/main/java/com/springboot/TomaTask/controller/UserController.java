package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.net.URI;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService UserService;
    //@CrossOrigin
    @GetMapping(value = "/user")
    public List<User> getAllUsers(){
        return UserService.findAll();
    }
    //@CrossOrigin
    @GetMapping(value = "/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id){
        try{
            ResponseEntity<User> responseEntity = UserService.getUserById(id);
            return new ResponseEntity<User>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @PostMapping(value = "/user")
    public ResponseEntity addUser(@RequestBody User User) throws Exception{
        User td = UserService.addUser(User);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location",""+td.getID());
        responseHeaders.set("Access-Control-Expose-Headers","location");
        //URI location = URI.create(""+td.getID())

        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }
    //@CrossOrigin
    @PutMapping(value = "/user/{id}")
    public ResponseEntity updateUser(@RequestBody User User, @PathVariable String id){
        try{
            User User1 = UserService.updateUser(id, User);
            System.out.println(User1.toString());
            return new ResponseEntity<>(User1,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @DeleteMapping(value = "/user/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable("id") String id){
        Boolean flag = false;
        try{
            flag = UserService.deleteUser(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(flag,HttpStatus.NOT_FOUND);
        }
    }
}
