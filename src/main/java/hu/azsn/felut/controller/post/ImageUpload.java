package hu.azsn.felut.controller.post;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
public class ImageUpload {
    private List<MultipartFile> images;
    private List<String> types;
    private List<String> sizes;
}
