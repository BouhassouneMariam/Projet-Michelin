import {
  FriendshipStatus,
  PrismaClient,
  Role
} from "@prisma/client";
import { seedCollections } from "../data/seed-collections";
import { seedMichelinRestaurants } from "../data/michelin/import-michelin";
import { seedMichelinMapRestaurants } from "../data/michelin/import-michelin-map";
import { seedRestaurants } from "../data/seed-restaurants";
import { DEMO_USER_ID, seedUsers } from "../data/seed-users";

const prisma = new PrismaClient();

async function main() {
  for (const user of seedUsers) {
    const userData = {
      ...user,
      role: user.role === "ADMIN" ? Role.ADMIN : Role.USER
    };

    await prisma.user.upsert({
      where: { id: user.id },
      update: userData,
      create: userData
    });
  }

  for (const restaurant of seedRestaurants) {
    const { tags, ...restaurantData } = restaurant;

    await prisma.restaurant.upsert({
      where: { id: restaurant.id },
      update: restaurantData,
      create: restaurantData
    });

    for (const restaurantTag of tags) {
      const createdTag = await prisma.tag.upsert({
        where: { slug: restaurantTag.slug },
        update: {
          name: restaurantTag.name,
          type: restaurantTag.type
        },
        create: restaurantTag
      });

      await prisma.restaurantTag.upsert({
        where: {
          restaurantId_tagId: {
            restaurantId: restaurant.id,
            tagId: createdTag.id
          }
        },
        update: {},
        create: {
          restaurantId: restaurant.id,
          tagId: createdTag.id
        }
      });
    }
  }

  await prisma.follow.upsert({
    where: {
      followerId_followedId: {
        followerId: DEMO_USER_ID,
        followedId: "user-ines"
      }
    },
    update: {},
    create: {
      followerId: DEMO_USER_ID,
      followedId: "user-ines"
    }
  });

  await prisma.follow.upsert({
    where: {
      followerId_followedId: {
        followerId: DEMO_USER_ID,
        followedId: "user-eliott"
      }
    },
    update: {},
    create: {
      followerId: DEMO_USER_ID,
      followedId: "user-eliott"
    }
  });

  await prisma.follow.upsert({
    where: {
      followerId_followedId: {
        followerId: "user-nora",
        followedId: DEMO_USER_ID
      }
    },
    update: {},
    create: {
      followerId: "user-nora",
      followedId: DEMO_USER_ID
    }
  });

  const likes = [
    ["user-ines", "rest-paris-septime"],
    ["user-ines", "rest-paris-shabour"],
    ["user-eliott", "rest-paris-frenchie"],
    ["user-eliott", "rest-london-brat"],
    ["user-nora", "rest-tokyo-den"],
    ["user-nora", "rest-newyork-atomix"],
    [DEMO_USER_ID, "rest-paris-septime"],
    [DEMO_USER_ID, "rest-paris-chocho"]
  ] as const;

  for (const [userId, restaurantId] of likes) {
    await prisma.restaurantLike.upsert({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId
        }
      },
      update: {},
      create: {
        userId,
        restaurantId
      }
    });
  }

  for (const collection of seedCollections) {
    const { restaurantIds, ...collectionData } = collection;

    await prisma.collection.upsert({
      where: { id: collection.id },
      update: collectionData,
      create: collectionData
    });

    for (const restaurantId of restaurantIds) {
      await prisma.collectionItem.upsert({
        where: {
          collectionId_restaurantId: {
            collectionId: collection.id,
            restaurantId
          }
        },
        update: {},
        create: {
          collectionId: collection.id,
          restaurantId
        }
      });
    }
  }

  await seedMichelinRestaurants(prisma);
  await seedMichelinMapRestaurants(prisma);

  const badges = [
    {
      id: "badge-first-collection",
      name: "First Collection",
      slug: "first-collection",
      description: "Created a first personal restaurant collection.",
      icon: "sparkles"
    },
    {
      id: "badge-city-curator",
      name: "City Curator",
      slug: "city-curator",
      description: "Saved restaurants in multiple cities.",
      icon: "map"
    }
  ];

  for (const badge of badges) {
    const createdBadge = await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge
    });

    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: DEMO_USER_ID,
          badgeId: createdBadge.id
        }
      },
      update: {},
      create: {
        userId: DEMO_USER_ID,
        badgeId: createdBadge.id
      }
    });
  }

  const { seedQuestions } = await import("../data/seed-questions");
  for (const q of seedQuestions) {
    const { options, ...questionData } = q;
    const createdQuestion = await prisma.question.upsert({
      where: { key: q.key },
      update: questionData,
      create: questionData
    });

    for (const opt of options) {
      await prisma.questionOption.upsert({
        where: { id: `${q.key}-${opt.value}` },
        update: opt,
        create: {
          id: `${q.key}-${opt.value}`,
          ...opt,
          questionId: createdQuestion.id
        }
      });
    }
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
