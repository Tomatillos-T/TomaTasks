package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.*;
import com.springboot.TomaTask.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    // Map selected fields from the Task entity
    @Mapping(target = "user", source = "user", qualifiedByName = "toUserDTO")
    @Mapping(target = "sprint", source = "sprint", qualifiedByName = "toSprintDTO")
    @Mapping(target = "userStory", source = "userStory", qualifiedByName = "toUserStoryDTO")
    // @Mapping(target = "description", ignore = true) // Ignore description field
    TaskDTO toDTO(Task task);

    @Named("toUserDTO")
    default UserDTO toUserDTO(User user) {
        return user == null ? null : new UserDTO(user.getID(), user.getName());
    }

    @Named("toSprintDTO")
    default SprintDTO toSprintDTO(Sprint sprint) {
        return sprint == null ? null : new SprintDTO(sprint.getId(), sprint.getDescription());
    }

    @Named("toUserStoryDTO")
    default UserStoryDTO toUserStoryDTO(UserStory story) {
        return story == null ? null : new UserStoryDTO(story.getId(), story.getName());
    }
}
