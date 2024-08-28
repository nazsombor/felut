package hu.azsn.felut.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import hu.azsn.felut.controller.post.ImageUpload;
import hu.azsn.felut.controller.post.PostDto;
import hu.azsn.felut.controller.post.PostUpload;
import hu.azsn.felut.repository.ImageRepository;
import hu.azsn.felut.repository.PostRepository;
import hu.azsn.felut.table.Image;
import hu.azsn.felut.table.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ImageRepository imageRepository;

    @GetMapping("/posts")
    public List<PostDto> getAllPosts() {

        List<Post> all = postRepository.findAll();
        ArrayList<PostDto> dtos = new ArrayList<>();

        for (Post post : all) {
            PostDto dto = new PostDto();
            dto.setText(post.getText());
            dtos.add(dto);
        }

        return dtos;
    }

    @GetMapping("/posts/create-new")
    public ResponseEntity<Long> createPost() {
        Post post = new Post();
        post.setIsPublished(false);
        postRepository.save(post);
        return ResponseEntity.ok().body(post.getId());
    }

    @PostMapping(path="posts/upload-images/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<List<String>> createPost(@PathVariable Long id, @ModelAttribute ImageUpload body) throws IOException {

        Post post = postRepository.findById(id).get();

        int i = 0;
        for (MultipartFile multipartFile : body.getImages()) {
            Image image = new Image();
            image.setData(multipartFile.getBytes());
            image.setPost(post);
            image.setType(body.getTypes().get(i));
            image.setSize(Integer.parseInt(body.getSizes().get(i)));
            imageRepository.save(image);
            i++;
        }

        post = postRepository.findById(id).get();

        ArrayList<String> urls = new ArrayList<>();
        for (Image image : post.getImages()) {
            urls.add("/kep/" + image.getId().toString());
        }

        return ResponseEntity.ok().body(urls);
    }

    @PostMapping(path="posts/upload-post/{id}")
    public ResponseEntity<Void> createPost(@PathVariable Long id, @RequestBody String body) throws JsonProcessingException {
        Post post = postRepository.findById(id).get();
        post.setText(body);
        post.setIsPublished(true);
        postRepository.save(post);
        return ResponseEntity.ok().build();
    }

    @PutMapping("posts/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setText(postDetails.getText());
                    Post updatedPost = postRepository.save(post);
                    return ResponseEntity.ok().body(updatedPost);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("posts/{id}")
    public ResponseEntity<Object> deletePost(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(post -> {
                    postRepository.delete(post);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("kep/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
        return imageRepository.findById(imageId)
                .map(image -> {
                    String filename = "";
                    MediaType type = MediaType.parseMediaType(image.getType());
                    filename += image.getId().toString();
                    switch (image.getType()) {
                        case "image/jpeg":
                            filename += ".jpg";
                            break;
                        case "image/png":
                            filename += ".png";
                            break;
                    }
                    return ResponseEntity.ok()
                            .contentType(type)
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                            .body(image.getData());
                })
                .orElse(ResponseEntity.notFound().build());
    }
}