package com.example.shose.server.infrastructure.excel;


public class ExcelUtils {

    // ${fun:validateHttp(data.http)}
    public String validateHttp(boolean flag){
        if(flag)
            return "Yes";
        return "No";
    }
}
