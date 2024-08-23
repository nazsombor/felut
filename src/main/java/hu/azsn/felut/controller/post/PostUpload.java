package hu.azsn.felut.controller.post;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class PostUpload {
    String postText;
    List<MultipartFile> file;
}
