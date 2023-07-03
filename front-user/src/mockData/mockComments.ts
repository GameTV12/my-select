enum LikeStatus {
    LIKED = 'LIKED',
    DISLIKED = 'DISLIKED',
    NONE = 'NONE'
}

export const allComments = [
    {
        id: "NSLC-1202-KLDB",
        nickname: "Langer",
        linkNickname: "langer123",
        userId: "USER-1230",
        image: "dsaafasdf",
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        time: 1687235329542,
        likes: 112490,
        dislikes: 90999,
        status: LikeStatus.NONE
    },
    {
        id: "POLC-1202-KLDB",
        nickname: "GameTV",
        linkNickname: "gametvcity",
        userId: "USER-4480",
        image: "poimzcvu",
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        time: 1687238501542,
        likes: 50,
        dislikes: 14,
        status: LikeStatus.NONE
    },
    {
        id: "CIII-NSPE-CTIO",
        nickname: "ForcePro99",
        linkNickname: "gametvcity",
        userId: "USER-1235",
        image: "poimzcvu",
        replyTo: "POLC-1202-KLDB",
        replyText: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        replyNickname: "GameTV",
        text: "Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        time: 1687245501842,
        likes: 392,
        dislikes: 88,
        status: LikeStatus.NONE
    },
    {
        id: "CIII-NSPE-ORIB",
        nickname: "Electricity",
        linkNickname: "gametvcity",
        userId: "USER-4454",
        image: "poimzcvu",
        replyTo: "CIII-NSPE-CTIO",
        replyText: "Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        replyNickname: "ForcePro99",
        text: "Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        time: 1687335506842,
        likes: 0,
        dislikes: 6,
        status: LikeStatus.NONE
    },
    {
        id: "WINN-YWAL-KERQ",
        nickname: "Dave Smith",
        linkNickname: "gametvcity",
        userId: "USER-9235",
        image: "poimzcvu",
        replyTo: "POLC-1202-KLDB",
        replyText: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        replyNickname: "GameTV",
        text: "Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        time: 1687396201842,
        likes: 123,
        dislikes: 456,
        status: LikeStatus.NONE
    },
    {
        id: "MYID-KREE-PERQ",
        nickname: "Electricity",
        linkNickname: "gametvcity",
        userId: "USER-4454",
        image: "poimzcvu",
        text: "Donec vitae arcu. Fusce nibh. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer lacinia. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nulla non lectus sed nisl molestie malesuada. In rutrum. Etiam posuere lacus quis dolor. Curabitur bibendum justo non orci. Praesent id justo in neque elementum ultrices. Nulla est.\n" +
            "\n" +
            "\n" +
            "\n" +
            "Fusce tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer lacinia. Vivamus ac leo pretium faucibus. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Aenean placerat. Aliquam erat volutpat. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. In rutrum. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Duis risus.",
        time: 1687406201842,
        likes: 123,
        dislikes: 456,
        status: LikeStatus.NONE
    },
]