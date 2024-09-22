package com.example.demo.controller;

import com.example.demo.model.RequestModel;
import com.example.demo.model.ResponseModel;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bfhl")
public class ApiController {


    @GetMapping(produces = "application/json")
    public ResponseEntity<Object> getOperationCode() {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("operation_code", 1));
    }


    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> processData(@RequestBody RequestModel request) {
        ResponseModel response = new ResponseModel();


        String userId = "john_doe_17091999";
        response.setUser_id(userId);
        response.setIs_success(true); 


        List<String> numbers = new ArrayList<>();
        List<String> alphabets = new ArrayList<>();
        String highestLowercase = "";

        if (request.getData() != null) {
            for (String element : request.getData()) {

                if (StringUtils.isNumeric(element)) {
                    numbers.add(element);
                } else {
                    alphabets.add(element);
                    if (element.length() == 1 && Character.isLowerCase(element.charAt(0))) {
                        if (highestLowercase.isEmpty() || element.charAt(0) > highestLowercase.charAt(0)) {
                            highestLowercase = element;
                        }
                    }
                }
            }
        }

        response.setNumbers(numbers);
        response.setAlphabets(alphabets);
        response.setHighest_lowercase_alphabet(new ArrayList<>(List.of(highestLowercase)));

        boolean isFileValid = false;
        String mimeType = "";
        String fileSizeKb = "0";
        if (request.getFile_b64() != null && !request.getFile_b64().isEmpty()) {
            try {
                byte[] decodedFile = Base64.getDecoder().decode(request.getFile_b64());
                mimeType = "application/octet-stream"; 
                fileSizeKb = String.valueOf(decodedFile.length / 1024);
                isFileValid = true; 
            } catch (Exception e) {
                isFileValid = false;
                response.setIs_success(false);
            }
        }

        response.setFile_valid(isFileValid);
        response.setFile_mime_type(mimeType);
        response.setFile_size_kb(fileSizeKb);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
