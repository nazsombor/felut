package hu.azsn.felut.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<PostDto> getAllPosts() {

        List<Post> all = postRepository.findAll();
        ArrayList<PostDto> dtos = new ArrayList<>();

        for (Post post : all) {
            PostDto dto = new PostDto();
            dto.setText(post.getText());
            ArrayList<String> images = new ArrayList<>();
            for (Image image : post.getImages()) {
                String base64 = Base64.getEncoder().encodeToString(image.getData());
                images.add(base64);
            }
            dto.setImages(images);
            dtos.add(dto);
        }


        return dtos;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public Post createPost(@ModelAttribute PostUpload pu) throws IOException {
        Post post = new Post();
        post.setText(pu.getPostText());

        ArrayList<Image> images = new ArrayList<>();
        for (MultipartFile multipartFile : pu.getFile()) {
            Image image = new Image();
            image.setData(multipartFile.getBytes());
            image.setPost(post);
            images.add(image);
        }

        post.setImages(images);

        return postRepository.save(post);
    }

    @PostMapping
    public Post createPost(@RequestPart("test") String postJson, @RequestPart("test2") String post2) {
        Post post = null;
        try {
            post = objectMapper.readValue(postJson, Post.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        System.out.println(post);
        System.out.println(post2);
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(post -> ResponseEntity.ok().body(post))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setText(postDetails.getText());
                    post.setImages(postDetails.getImages());
                    Post updatedPost = postRepository.save(post);
                    return ResponseEntity.ok().body(updatedPost);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePost(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(post -> {
                    postRepository.delete(post);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{postId}/images/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long postId, @PathVariable Long imageId) {
        return imageRepository.findById(imageId)
                .filter(image -> image.getPost().getId().equals(postId))
                .map(image -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"image.jpg\"")
                        .body(image.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}