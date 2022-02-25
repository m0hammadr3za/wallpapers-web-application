import { Link } from "react-router-dom";
import CoverImage from "./CoverImage";
import StandardTime from "./StandardTime";
import "../styles/CollectionCard.scss";

interface CollectionCardTypes {
    data: {
        _id: string;
        user: { username: string };
        createdAt: number;
        wallpaper: { imageUrl: { thumbnail: string } };
        title: string;
        wallpaperCount: number;
    };
}

function CollectionCard(props: CollectionCardTypes | any) {
    const { _id, user, createdAt, wallpaper, title, wallpaperCount } =
        props.data;

    return (
        <div className="collection-card">
            <div className="collection-card__primary-info">
                <p className="collection-card__publisher">
                    By <a href="/#">@{user.username}</a>
                </p>

                <p className="collection-card__publish-date">
                    Published At <StandardTime time={createdAt} />
                </p>
            </div>

            <Link
                to={`/collection/${_id}`}
                className="collection-card__image-container"
            >
                <CoverImage src={wallpaper.imageUrl.thumbnail} />

                <div className="collection-card__image-overlay" />

                <h1 className="collection-card__title collection-card__title--lg">
                    {title}
                </h1>
            </Link>

            <div className="collection-card__secondary-info">
                <h1 className="collection-card__title collection-card__title--sm">
                    {title}
                </h1>

                <div className="collection-card__btn">
                    <div className="collection-card__link">
                        <Link to={`/collection/${_id}`}>SEE COLLECTION</Link>
                    </div>

                    <p className="collection-card__wallpaper-count">
                        {wallpaperCount} Wallpaper
                        {wallpaperCount > 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CollectionCard;
