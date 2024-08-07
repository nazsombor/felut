package hu.azsn.felut.repository;

import hu.azsn.felut.table.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByEmail(String email);
}
