package hu.azsn.felut.table;

import jakarta.persistence.*;

import lombok.Data;

import java.sql.Blob;

@Entity
@Data
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private Integer size;

    @Column(length = 5 * 1024 * 1024)
    @Lob
    private byte[] data;

    @ManyToOne
    @JoinColumn(name="post_id")
    private Post post;
}