import type { CollectionDto } from "@/types/api";

export function renderCollectionShareImage(collection: CollectionDto) {
  const itemImages = collection.items
    .slice(0, 4)
    .map((item) => item.restaurant.imageUrl)
    .filter(Boolean);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #1d1811 0%, #12100d 55%, #0d0b08 100%)",
        color: "#f3eee2",
        padding: "44px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0",
          display: "flex",
          background:
            "radial-gradient(circle at top right, rgba(189, 35, 51, 0.18), transparent 32%), radial-gradient(circle at bottom left, rgba(158, 140, 101, 0.16), transparent 30%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          borderRadius: "36px",
          border: "1px solid rgba(243, 238, 226, 0.14)",
          background: "rgba(255, 255, 255, 0.04)",
          padding: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              color: "#bd2333",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.18em",
              marginBottom: 18,
            }}
          >
            MICHELIN COLLECTION
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: "760px",
            }}
          >
            {collection.title}
          </div>
          <div
            style={{
              color: "rgba(243, 238, 226, 0.72)",
              fontSize: 24,
              marginTop: 16,
            }}
          >
            Par {collection.owner.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "18px",
            width: "100%",
          }}
        >
          {itemImages.length > 0 ? (
            itemImages.map((src, index) => (
              <img
                key={index}
                src={src || ""}
                alt=""
                style={{
                  width: "calc(50% - 9px)",
                  height: "190px",
                  borderRadius: "24px",
                  objectFit: "cover",
                  border: "1px solid rgba(243, 238, 226, 0.12)",
                }}
              />
            ))
          ) : (
            <div
              style={{
                width: "100%",
                height: "398px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.06)",
                color: "rgba(243, 238, 226, 0.6)",
                fontSize: 28,
              }}
            >
              Aucun visuel disponible
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "rgba(243, 238, 226, 0.5)",
              fontSize: 20,
            }}
          >
            <div>Michelin Next Gen</div>
            <div>{collection.items.length} restaurants</div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "170px",
              height: "56px",
              borderRadius: "999px",
              background: "#bd2333",
              color: "#fff6ea",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Share
          </div>
        </div>
      </div>
    </div>
  );
}
