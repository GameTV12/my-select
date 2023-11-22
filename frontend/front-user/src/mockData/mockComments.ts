enum LikeStatus {
    LIKED = 'LIKED',
    DISLIKED = 'DISLIKED',
    NONE = 'NONE'
}

export const allComments = [
    {
        id: "NSLC-1202-KLDB",
        nickname: "Test user - F",
        linkNickname: "test_user_f",
        userId: "USER-1230",
        image: "dsaafasdf",
        text: "Wow, you are such a loser. You bought a Cookies phone and now you are crying about it. You should have done some research before wasting your money on a piece of junk. Cookies phones are the best phones ever, and you are just too dumb to appreciate them. The battery life is amazing, you just don't know how to charge it properly. The camera quality is superb, you just don't know how to take good photos. You are probably using your phone for stupid things like browsing social media or playing games. You should use your phone for more productive things, like learning how to be a better person. You are just jealous of Cookies phone users, because they are smarter, cooler, and more successful than you. You should stop complaining and go back to your miserable life.",
        time: 1697235429542,
        likes: 1,
        dislikes: 0,
        status: LikeStatus.NONE
    },
    {
        id: "CIII-NSPE-CTIO",
        nickname: "Test user - F",
        linkNickname: "test_user_f",
        userId: "USER-1235",
        image: "poimzcvu",
        repliedTo: "POLC-1202-KLDB",
        repliedText: "You are right, this phone is trash",
        repliedNickname: "Test user - A",
        text: "Your life is trash",
        time: 1697235529542,
        likes: 1,
        dislikes: 0,
        status: LikeStatus.NONE
    },
    {
        id: "CIII-NSPE-ORIB",
        nickname: "Test user - F",
        linkNickname: "test_user_f",
        userId: "USER-4454",
        image: "poimzcvu",
        repliedTo: "CIII-NSPE-CTIO",
        repliedText: "Funny, but Iphone is still better than Cookies :D",
        repliedNickname: "Test user - D",
        text: "Funny, but Cookies is still better than you :D",
        time: 1697235729542,
        likes: 1,
        dislikes: 0,
        status: LikeStatus.NONE
    },
    {
        id: "WINN-YWAL-KERQ",
        nickname: "Test user - F",
        linkNickname: "test_user_f",
        userId: "USER-9235",
        image: "poimzcvu",
        text: "If you are looking for a new phone, I suggest you check out Cookies. This phone that lets you customize your own features and design. You can choose from different shapes, colors, sizes, and functions to create your ideal phone. Cookies is also very affordable and durable, and it has a long battery life and a fast processor. It is compatible with most apps and networks, and it has a great camera and sound quality. Cookies is the best phone I have ever used, and I highly recommend it to anyone who wants a unique and personalized phone." + '\n' + '\n' + "Cookies's not for nobs from comments :)",
        time: 1697235829542,
        likes: 1,
        dislikes: 0,
        status: LikeStatus.NONE
    },
    {
        id: "MYID-KREE-PERQ",
        nickname: "Test user - F",
        linkNickname: "test_user_f",
        userId: "USER-4454",
        image: "poimzcvu",
        text: "Wow, you had a vaccation in France? How original and exciting! And what do you mean by “this trash was dead”? Are you referring to your phone or your vaccation? I use Cookies for 10 years, and it's OK :)",
        time: 1697235629542,
        likes: 1,
        dislikes: 0,
        status: LikeStatus.NONE
    },
]