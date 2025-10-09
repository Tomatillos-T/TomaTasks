package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService UserService;
    //@CrossOrigin
    @GetMapping
    public List<User> getAllUsers(){
        return UserService.findAll();
    }
    //@CrossOrigin
    @GetMapping(value = "/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id){
        try{
            ResponseEntity<User> responseEntity = UserService.getUserById(id);
            return new ResponseEntity<User>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @PostMapping
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
    @PutMapping(value = "/{id}")
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
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable("id") String id){
        Boolean flag = false;
        try{
            flag = UserService.deleteUser(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(flag,HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/telegram-token")
    public ResponseEntity<User> generateTelegramToken(@PathVariable String id) {
        try {
            User user = UserService.generateTelegramToken(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/telegram/validate")
    public ResponseEntity<User> validateTelegramToken(
            @RequestParam String token,
            @RequestParam String chatId) {
        try {
            User user = UserService.validateTelegramToken(token, chatId);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
